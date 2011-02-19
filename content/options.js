function GM_onloadOptions() {
  document.getElementById("check-uninstall")
      .checked = GM_prefRoot.getValue("uninstallPreferences");
  document.getElementById("check-leftclick-usercommands")
      .checked = GM_prefRoot.getValue("leftClickUsercommands");

  var hotkeymod = GM_prefRoot.getValue("globalHotkeyModifier");
  if (hotkeymod)
    document.getElementById("text-globalkey").value
        = GM_prefKeyModifier2String(hotkeymod)
        + String.fromCharCode(GM_prefRoot.getValue("globalHotkeyCode"));

  document.getElementById("text-globalkey").addEventListener("keydown", GM_prefGlobalkeyChanged, false);
}

function GM_acceptPrefs() {
  GM_prefRoot.setValue("uninstallPreferences",
      !!document.getElementById("check-uninstall").checked);
  GM_prefRoot.setValue("leftClickUsercommands",
      !!document.getElementById("check-leftclick-usercommands").checked);

  // FIXME:
  // We need reference to the GM_BrowserUI from browser.js
  // So we will be able to change hotkey preferences without a browser restart
  var GM_BrowserUI = GM_BrowserUI || {};  // !!! temporary workaround !!!

  GM_prefRoot.setValue("globalHotkeyCode",
      GM_BrowserUI.globalHotkeyCode =
      Number(document.getElementById("text-globalkey").getAttribute("hotkeyCode")));
  GM_prefRoot.setValue("globalHotkeyModifier",
      GM_BrowserUI.globalHotkeyModifier =
      Number(document.getElementById("text-globalkey").getAttribute("hotkeyModifier")));
}


function GM_prefGlobalkeyChanged(event) {
  var mod = 0;
  var key = event.keyCode;
  // 32 == space; 48-57 == 0-9; 65-90 == A-Z;
  if ((key >= 65 && key <= 90) || (key >= 48 && key <= 57) || key == 32) {
    mod += event.shiftKey ? 1 : 0;
    mod += event.ctrlKey  ? 2 : 0;
    mod += event.altKey   ? 4 : 0;
    event.target.value = mod ? GM_prefKeyModifier2String(mod) + String.fromCharCode(key) : "";
  }
  if (key == 27) { // Esc
    event.target.value = "";
    key = 0;
  }
  event.target.setAttribute("hotkeyModifier", mod);
  event.target.setAttribute("hotkeyCode", mod ? key : 0);
  event.stopPropagation();
  event.preventDefault();
}

function GM_prefKeyModifier2String(mod) {
  var str = "";
  if (mod & 1) str += "Shift + ";
  if (mod & 2) str += "Ctrl + ";
  if (mod & 4) str += "Alt + ";
  return  str;
}
