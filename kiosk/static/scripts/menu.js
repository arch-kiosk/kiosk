
$('document').ready(function () {

  trigger = $('#hamburger');
  trigger.click(function () {
    closeMenu('#user-menu',$('#currentuser'));
    showhidemenu('#hamburger','#main-menu');
  });

  $('#currentuser').click(function () {
    closeMenu('#main-menu',$('#hamburger'));
    showhidemenu('#currentuser','#user-menu');
  });

});

function showhidemenu(triggerid, menuid) {
  console.log(`showing / hiding menu #${menuid}`)
  trigger = $(triggerid);
  isClosed = !trigger.hasClass("is-open");
  if (!isClosed) {
    closeMenu(menuid, trigger);
  } else {
    openMenu(menuid, trigger)
  }
}

function openMenu(menu_id, trigger) {
  trigger.removeClass('is-closed');
  trigger.addClass('is-open');
  $(menu_id + '.dropdown-content').fadeIn("fast");
  // isClosed = true;
}

function closeMenu(menu_id, trigger) {
  trigger.removeClass('is-open');
  trigger.addClass('is-closed');
  $(menu_id + '.dropdown-content').fadeOut("fast");
  // isClosed = false;
}

function menuClick(action) {
  trigger = $('#hamburger');
  closeMenu("#main-menu", trigger);
  if (action) {
    action();
  }
}

function userMenuClick(item, param) {
  trigger = $('#currentuser');
  closeMenu("#user-menu", trigger);
  switch(item) {
    case "logout":
        triggerLogout(param);
        break;
    case "profile":
        triggerUserProfile(param);
        break;
    case "manage_time_zone":
        triggerManageTimeZone(param);
        break;
  }
}
