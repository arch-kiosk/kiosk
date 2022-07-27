let password_changed=false;
let logout_route = "";
let force_password_change = false;

/*********************************************
Logout User
***********************************************/
function triggerLogout(logout_route) {
  window.location.replace(logout_route);
}

/*********************************************
User Profile: Init Dialog
***********************************************/
function triggerUserProfile(route, change_password=false) {
  let password_changed = false;
  let force_password_change=change_password;

  $.magnificPopup.open({
  type: 'ajax',
  items: {
    src: route
    },
  focus: "mup-user-id",
  removalDelay: 200,
  mainClass: "mfp-with-anim",
  callbacks: {
      ajaxContentAdded: ()=>{
        initUserProfile(force_password_change);
      },
      onInit: ()=>{

      },
      beforeClose: ()=>{
        logout_route = $("#mup-form").attr("logout");
      },
      afterClose: ()=>{
        if (password_changed || force_password_change) {
          triggerLogout(logout_route);
        } else {
          location.reload();
        }
      }
    }
  });
}

function onMupCancel(e) {
  e.preventDefault();
  $.magnificPopup.close();

}

function initUserProfile(change_password=false) {
  bindReturnKeyToButtons("mup-form", "mup-ok", "mup-cancel");

  $("#mup-cancel").click((e) => {onMupCancel(e);});
  $("#mup-set-password").click(() => {onCheckPassword();});
  if (change_password) {
     $("#mup-set-password").prop("checked", true);
     $("#mup-set-password").hide();
     $("#mup-set-password").next().hide();
     onCheckPassword();
    dialog_ok("Please set a password.")
  }else{
    $("#mup-user-id").focus();
  }
  $("#mup-form").submit((e)=>{onSubmit(e)});
  //setTimeout(function () {$("#mup-user-id").focus();}, 300);
}

function onCheckPassword () {
  if ($("#mup-set-password").prop("checked")) {
    $("#change-password").show("fast");
    $("#mup-user-password").focus();

  }
  else {
    $("#change-password").hide("fast");
  }
}

function onSubmit(e) {
  let err = false;
  clearFieldErrors();
  if (e)
    e.preventDefault();

  console.log(e);
  if ($("#mup-set-password").prop("checked")) {
    if (String($("#mup-user-password").val()).trim() == "") {
      errorOnField("mup-user-password", "Please enter a password.");
      err = true
    }else{
      if (String($("#mup-user-password-check").val()).trim() == "") {
        errorOnField("mup-user-password-check", "Please enter the password again.");
        err = true
      }else{
        if (String($("#mup-user-password-check").val()) != String($("#mup-user-password").val())) {
          errorOnField("mup-user-password-check", "Please enter the s a m e password again.");
          err = true
        }
      }
    }
  }
  if (!err) {
    route = $("#mup-form").attr("action");
    $.post(route, $("#mup-form").serialize(),
      function (data) {
        if (data.result != "ok") {
          if (data.result == "exception") {
            console.log(data);
            errorOnDialog(data.msg);
          }
          else {
            for (let f in data.result) {
              let err_msg=data.result[f][0];
              let html_field = "mup-"+f.replace(/_/g,"-");
              console.log(html_field, err_msg);
              errorOnField(html_field, err_msg);
            }
          }
        } else {
          if ($("#mup-set-password").prop("checked")) {
            password_changed = true;
          }
          disable_input_fields("#mup-form");
          dialog_ok("New data saved successfully", ".dialog-button-bar");
        }
      }
    );
  }
}
//# sourceURL=user.js
