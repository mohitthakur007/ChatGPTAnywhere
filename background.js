// // Create a context menu item
// chrome.contextMenus.create({
//   id: "ask-chatgpt",
//   title: "Ask ChatGPT",
//   contexts: ["all"],
// });

// // Listen for when the user clicks on the context menu item
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === "ask-chatgpt") {
//     // Send a message to the content script
//     chrome.tabs.sendMessage(tab.id, { type: "ASK_CHATGPT" });
//   }
// });

// chrome.action.onClicked.addListener((info, tab) => {
// 	chrome.tabs.sendMessage(tab.id, { type: "ASK_CHATGPT" });
// });
//  async function getCurrentTab() {
//   let queryOptions = { active: true, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   const tabs = await chrome.tabs.query(queryOptions);
//   // let [tab] = await chrome.tabs.query(queryOptions);
//   return tabs;
// }
chrome.commands.onCommand.addListener(function(command) {
	chrome.windows.getCurrent(function(window) {
  console.log('Current window ID:', window.id);

  chrome.tabs.query({ windowId: window.id }, function(tabs) {
    console.log('Tabs in current window:', tabs);
  });
});

chrome.tabs.query({ highlighted: true}, function(tabs) {
  if (tabs.length > 0) {
    // There are tabs open in the current window, so call chrome.tabs.query() with additional options
    chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
      if (activeTabs.length > 0) {
        // Do something with the active tab
        var currentTabId = activeTabs[0].id;
            chrome.tabs.sendMessage(currentTabId, {type: "ASK_CHATGPT" });

        console.log('Current tab ID:', currentTabId);
      } else {
        console.error('No active tabs found.');
      }
    });
  } else {
    console.error('No tabs found.');
  }
});

});
// chrome.commands.onCommand.addListener(function(command) {
// 	console.log("hello broooo !!!!!");
// 	chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
//   	chrome.tabs.sendMessage(tabs[0].id, {type: "ASK_CHATGPT" }, function(response) {
//       console.log(response);
//   });
// }); 
//   	chrome.runtime.sendMessage({type: "ASK_CHATGPT" }, function(response) {
//   console.log("Response from background script:", response);
// });

// });

// chrome.commands.onCommand.addListener((info, tab) => {
// 	chrome.tabs.sendMessage(tab.id, { type: "ASK_CHATGPT" });
// });