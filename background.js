var enlightenMain = {
	enabled: 0,
	inlineToggle: function (tab) {
		if (enlightenMain.enabled) enlightenMain.inlineDisable(tab);
		else enlightenMain.inlineEnable(tab);
	},
	inlineDisable: function (tab) {
		this.enabled = 0;
		chrome.browserAction.setBadgeBackgroundColor({
			color: [0, 0, 0, 0]
		});
		chrome.browserAction.setBadgeText({
			text: ""
		});

		// Send a disable message to all browsers
		var windows = chrome.windows.getAll({
			populate: true
		}, function (windows) {
			for (var i = 0; i < windows.length; ++i) {
				var tabs = windows[i].tabs;
				for (var j = 0; j < tabs.length; ++j) {
					chrome.tabs.sendMessage(tabs[j].id, {
						type: "disable"
					});
				}
			}
		});
	},
	inlineEnable: function (tab) {
		chrome.tabs.sendMessage(tab.id, {
			"type": "enable"
		});
		this.enabled = 1;
		chrome.browserAction.setBadgeBackgroundColor({
			"color": [255, 0, 0, 255]
		});
		chrome.browserAction.setBadgeText({
			"text": "On"
		});
	},
	onTabSelect: function (tabId) {
		if ((this.enabled == 1))
			chrome.tabs.sendMessage(tabId, {
				"type": "enable"
			});
	}
};

chrome.browserAction.onClicked.addListener(enlightenMain.inlineToggle);

chrome.runtime.onMessage.addListener(
	function (request, sender, response) {
		switch (request.type) {
			case 'enable?':
				console.log('enable?');
				enlightenMain.onTabSelect(sender.tab.id);
				break;
			default:
				console.log(request);
		}
	}
);