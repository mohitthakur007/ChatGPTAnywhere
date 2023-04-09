chrome.commands.onCommand.addListener(function(command) {
		
	chrome.tabs.query({ active: true}, function(tabs) {
	  if (tabs.length > 0) {
	    // There are tabs open in the current window, so call chrome.tabs.query() with additional options
	        // Do something with the active tab
	        var currentTabId = tabs[0].id;
	            chrome.tabs.sendMessage(currentTabId, {type: "ASK_CHATGPT" });

	        console.log('Current tab ID:', currentTabId);
	      } else {
	        console.error('No active tabs found.');
	      }
	    });

});