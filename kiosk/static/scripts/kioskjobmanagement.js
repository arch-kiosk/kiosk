/**
 * reads job info from DOM or from given html. In html the job info must be encoded like this:
      <div id="mcp-job-info" jobid="MyJobId">
        <div id="result" result="True" message="my success message" ></div>
        <div id="progress" progress=100 message="my progress message" ></div>
      </div>

 * @param {string} jobInfoIdentifier: optional This is the id of the job info in the DOM or html
 * @param {string} html: optional if this is given the job info is fetched from this instead of the DOM
 * @returns a dictionary like this with optional progress and result (the keys will be there, but the values empty)
 *
 *              {
                  jobId: "MyJobId",
                  progress: {
                    message: "my progress message",
                    progress: 100
                  },
                  result: {
                    message: "my message",
                    success: false
                  }
                }

 **/
function getJobInfoFromHtml(jobInfoIdentifier = "", html = "") {
  let jqJobInfo;
  if (!jobInfoIdentifier)
    jobInfoIdentifier = "#mcp-job-info";

  if (html) {
    let jq = $("<div>" + html + "</div>"); //Necessary, because find does not search the top-most element!
    jqJobInfo = jq.find(jobInfoIdentifier);
  } else {
    jqJobInfo = $(jobInfoIdentifier);
  }

  if (jqJobInfo.length) {
    let jobInfo = {
      result: {},
      progress: {}
    };
    let jobId = jqJobInfo.attr('jobid');
    if (!jobId) return {};
    jobInfo.jobId = jobId;

    let jobResult = jqJobInfo.find("#result");
    if (jobResult.length) {
      jobInfo.result.success = undefstr(jobResult.attr("success")).toLowerCase() == "true";
      jobInfo.result.message = undefstr(jobResult.attr("message"));
    }
    let jobProgress = jqJobInfo.find("#progress");
    if (jobProgress.length) {

      jobInfo.progress.progress = undefint(jobProgress.attr("progress"), 0);
      jobInfo.progress.message = undefstr(jobProgress.attr("message"));
    }
    return jobInfo;
  } else {
    return {};
  }
}

/**
 * Convenience function that calls getJobInfoFromHtml and just returns the jobInfo.
 * @param {string} jobInfoIdentifier: see getJobInfoFromHtml
 * @param {string} html: see getJobInfoFromHtml
 */
function getJobIDFromHtml(jobInfoIdentifier = "", html = "") {
  let jobInfo = getJobInfoFromHtml(jobInfoIdentifier, html)
  if (jobInfo)
    return jobInfo.jobId;
  else
    return "";
}
