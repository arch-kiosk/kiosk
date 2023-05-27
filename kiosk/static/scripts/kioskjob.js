class KioskJob {
  constructor(jqTarget, url = "", timeout = 3000) {
    this.url = url;
    this.jqTarget = jqTarget;
    this.timeout = timeout;
    this.onError = undefined;
    this.onSuccess = undefined;
    this.onInitProgress = undefined;
    this.onProgress = undefined;
    this.onStopProgress = undefined;
    this.stopit = false;
    this._onLogLinesShown = undefined;
    this.jobUID = undefined
    this.polling_url = "/mcp_job_progress"
    this.url_job_log = "/mcp_job_log"
  }

  _onError(err_msg) {
    stop_spinner();
    if (this.onError) {
      this.onError(err_msg);
    } else {
      kioskErrorToast(err_msg);
    }
  }

  _onJSON(json) {
    this._onError(json.message);
  }

  _onJobDone(result) {
    this.result = result;
    if (this.onSuccess) {
      this.onSuccess(result);
    }
  }

  _onSuccess() {
    let workzone = this.jqTarget;
    let jobUID;

    let progress_view = workzone.find("#_kiosk-progress-view");
    if (!this.jobUID) {
      this.jobUID = progress_view.attr("job-uid");
      if (!this.jobUID) {
        this.jobUID = $("#mcp-job-info").attr("jobid");
      }
    }
    jobUID = this.jobUID;

    if (jobUID) {
      if (this.onInitProgress) {
        this.onInitProgress();
      } else {
        installSpinner(progress_view.find("#_progress-spinner-div"), "", false);
        let heading = progress_view.find(".kiosk-progress-heading");
        heading.text("Initializing, hang on...");
        heading.fadeIn("slow");
      }
      this._pollJobProgress(progress_view);
    } else {
      this._onError("The job might have been started but the job-id did not <br>make it through the " +
        "network. You might want to <br>check <a href='/administration/processes'>in the process view</a> " +
        "if it is still running.");
    }
  }

  _pollJobProgress(jq_progress_view=undefined) {
    this._jq_progress_view = jq_progress_view;

    this._poll();
  }

  _setup_progress(topic) {
    let jq_progress = this._jq_progress_view.find(`#kiosk-progress-${topic}`);
    let jq_progress_list = this._jq_progress_view.find(`.kiosk-progresses-div`);
    if (jq_progress.length == 0) {
      let heading = this._jq_progress_view.find(".kiosk-progress-heading");
      if (heading.text())
        heading.fadeOut("slow");

      let jq_progress_template = this._jq_progress_view.find(`#templates .kiosk-progress`);
      if (jq_progress_template.length != 0) {
        jq_progress_template = jq_progress_template.clone(false);
        jq_progress_template.attr("id", `kiosk-progress-${topic}`);
        jq_progress_list.append(jq_progress_template);
      }
      jq_progress = this._jq_progress_view.find(`#kiosk-progress-${topic}`);
    }
    return jq_progress.length > 0;
  }

  _set_progress(topic, progress, message) {
    let jqProgress = this._jq_progress_view.find(`#kiosk-progress-${topic}`);
    if (jqProgress.length > 0) {
      let jqBar = jqProgress.find(".kiosk-progress-bar");
      let jqProgressText = jqProgress.find(".kiosk-progress-text");
      jqBar.css("width", progress + "%");
      jqProgressText.text(progress + "%");
      let jqProgressMessage = jqProgress.find(".kiosk-progress-msg");
      jqProgressMessage.text(message);
    }
  }

  _get_sorted_topics(progress) {
    let topics = Object.keys(progress);
    topics = topics.filter(s => !(s === "progress" || s === "message"));
    if (topics.length > 0) {
      topics = Object.values(topics).sort((a, b) => {
        let comp_a = a, comp_b = b;
        if ("order" in progress[a] && "order" in progress[b]) {
          comp_a = progress[a].order;
          comp_b = progress[b].order;
        }
        if (comp_a < comp_b)
          return -1;
        else if (comp_a > comp_b)
          return 1;
        return 0
      });
      return topics;
    }
    return [];
  }

  _pollSuccess(json) {
    try {
      if ("progress" in json) {
        if ("progress" in json.progress) {
          if (this.onProgress) {
            this.onProgress(undefint(json.progress.progress), undefstr(json.progress.message), "");
          } else {
            if (this._setup_progress("progress"))
              this._set_progress("progress", json.progress.progress, json.progress.message);
          }
        }

        let topics = this._get_sorted_topics(json.progress);
        if (topics.length > 0) {
          console.log(topics);
          for (const key of topics)
            if (key !== "message" && key !== "progress")
              if (this.onProgress) {
                this.onProgress(undefint(json.progress.progress), undefstr(json.progress.message), key);
              } else {
                if (this._setup_progress(key)) {
                  this._set_progress(key, json.progress[key].progress, json.progress[key].message);
                }
              }
        }
      }
    }
    catch (err) {
      console.log("Error while polling status: " + err.message);
    }

    this.status = json.status;
    if (json.status < JOB_STATUS_DONE) {
      // if (json.progress.progress && json.progress.message) {
      //   // $("#ws-message-div").html(`${json.progress.progress}%: ${json.progress.message}`);
      // }
      setTimeout(() => {
        this._poll();
      }, 1000);

    } else {
      if (this.onStopProgress) {
        this.onStopProgress();
      } else {
        stop_spinner();
      }
      console.log(json);
      if (json.result.success) {
        this._onJobDone(json.result);
      } else {
        this._onError(json.result.message);
      }
    }
  }

  _stopJob() {
    kioskAjax("/administration/processes/action",
      {
        action: "cancel",
        uid: this.jobUID
      }, "POST",
      {
        onError: this._onError.bind(this)
      });
    this.status = JOB_STATUS_CANCELLING;
    this._onError("You have cancelled this job.");
  }

  _poll() {
    if (this.stopit) {
      this._stopJob();
      return;
    }

    kioskAjax(this.polling_url,
      {"job_uid": this.jobUID},
      "POST",
      {
        onSuccess: this._pollSuccess.bind(this),
        onError: this._onError.bind(this)
      }
    )
  } //function poll

  start() {
    let jqTargetToReplace = this.jqTarget.find(":first-child");
    if (!jqTargetToReplace) {
      throw "target has no child to replace. That must not be the case."
    }
    kioskAjaxGetPartial(this.url,
      {},
      jqTargetToReplace,
      this._onSuccess.bind(this),
      this._onError.bind(this),
      {},
      {
        async: false,
        timeout: this.timeout
      },
      this._onJSON.bind(this),
      "_kiosk-progress-view"
    )
  }

  connect(jobUID = "") {
    let jqTargetToReplace = this.jqTarget.find(":first-child");
    if (jobUID) this.jobUID = jobUID;
    if (!jqTargetToReplace) {
      throw "target has no child to replace. That must not be the case."
    }
    this._onSuccess.call(this)
  }


  _displayLogLines(log, subHeading = "") {
    let jqLogView = this._jq_progress_view.find(".kiosk-log-view");

    if (subHeading) {
      let jqHeading = jqLogView.find(".kiosk-log-heading");
      jqHeading.append(`<span class="kiosk-log-subheading"><br>${subHeading}</span>`);
    }

    let jqLogLineTemplate = jqLogView.find(".kiosk-log-line").clone();
    jqLogView.find(".kiosk-log-line").remove();
    for (const logline of log) {
        if (/: -$/i.test(logline)) {
          let jqSeparator = jqLogLineTemplate.clone();
          jqSeparator.addClass("kiosk-log-line-separator")
          jqSeparator.text(" ");
          jqLogView.append(jqSeparator);
        } else {


          let jqNewLine = jqLogLineTemplate.clone();
          jqNewLine.text(logline);
          if (/error/i.test(logline))
            jqNewLine.addClass("kiosk-log-line-error")
          else if (/warning/i.test(logline))
            jqNewLine.addClass("kiosk-log-line-warning")
          else if (/success/i.test(logline) || /note/i.test(logline))
            jqNewLine.addClass("kiosk-log-line-success")
          else
            jqNewLine.addClass("kiosk-log-line-info")

          jqLogView.append(jqNewLine);
        }
    }
    if (this._onLogLinesShown) {
      this._onLogLinesShown(true);
    }
  };

  _setupLogLines(heading, log_level) {
    let jqLogView = this._jq_progress_view.find(".kiosk-log-view");
    jqLogView = jqLogView.clone(false);
    if (jqLogView.length > 0) {
      this._jq_progress_view.empty();
      this._jq_progress_view.append(jqLogView);
      jqLogView = this._jq_progress_view.find(".kiosk-log-view");
      let jqHeading = jqLogView.find(".kiosk-log-heading");
      jqHeading.text(heading);
      if (log_level.toLowerCase() === "warning")
        jqHeading.addClass("log-success-heading");
      else
        jqHeading.addClass("log-error-heading");

      return true;
    } else
      return false;
  }

  /**
   * showLogLines
   * @param heading
   * @param onError
   * @param onLogLinesShown: a callback with signature LogLinesShown(linesPresent: bool, heading=""). linesPresent will be False if
   *        a log_level was given and no lines have been returned. It is only in this case that "heading" is given and
   *        contains the original success message that came from the server.
   * @param log_level: "warning" shows warnings and errors, "error" only errors and "" all log lines.
   * @param subHeading: this sub heading is optional.
   * @returns {boolean}
   */
  showLogLines(heading, onError, onLogLinesShown, log_level = "", subHeading = "") {
    this._onLogLinesShown = onLogLinesShown;
    if (this._jq_progress_view && this._jq_progress_view.length > 0 && this.jobUID) {
      if (this._setupLogLines(heading, log_level)) {
        kioskAjax(this.url_job_log,
          {
            "job_uid": this.jobUID,
            "log_level": log_level
          },
          "POST",
          {
            onSuccess: (log) => {
              // console.log(log);
              if (log_level && log.length == 0) {
                onLogLinesShown(false, heading);
              } else {
                this._displayLogLines(log, subHeading);
              }
            },
            onError: onError
          }
        );
        return true;
      }
    }
    return false;
  }

}

//# sourceURL=kioskjob.js