(function () {
  'use strict';

  var browserExtension = new HypotheisChromeExtension({
    chromeTabs: chrome.tabs,
    chromeBrowserAction: chrome.browserAction,
    getExtensionURL: function (path) {
      return chrome.extension.getURL(path);
    },
    isAllowedFileSchemeAccess: function () {
      return chrome.extension.isAllowedFileSchemeAccess();
    },
  });

  browserExtension.listen(window);
  chrome.runtime.onInstalled.addListener(onInstalled)
  chrome.runtime.onUpdateAvailable.addListener(onUpdateAvailable)

  function onInstalled(installDetails) {
    if (installDetails.reason === 'install') {
      chrome.tabs.create({url: 'https://hypothes.is/welcome'}, function (tab) {
        state(tab.id, 'active');
      });
    }

    /* We need this so that 3-rd party cookie blocking does not kill us.
       See https://github.com/hypothesis/h/issues/634 for more info.
       This is intended to be a temporary fix only.
       */
    var details = {
      primaryPattern: 'https://hypothes.is/*',
      setting: 'allow'
    }
    chrome.contentSettings.cookies.set(details)
    chrome.contentSettings.images.set(details)
    chrome.contentSettings.javascript.set(details)

    browserExtension.install();
  }

  function onUpdateAvailable() {
    chrome.runtime.reload()
  }
}();
