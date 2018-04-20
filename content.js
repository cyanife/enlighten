var enlightenContext = {
	enableTab: function () {
		let answers = [];
		// get answer
		$.ajax({
			type: "POST",
			url: "http://xxjs.dtdjzx.gov.cn/quiz-api/game_info/lookBackSubject",
			data: {
				roundOnlyId: JSON.parse(localStorage.w_allHuiKan2).data.roundOnlyId
			},
			dataType: "json",
			success: function (res) {
				let data = res.data.dateList;
				var str = "";
				if (res.code == 200 && data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						answers.push(data[i].answer);
					}
					showAnswer();
				} else {
					console.log("答案获取失败！");
				}
			}
		})
		// display message
		this.showMessage();
		// display correct answer
		function showAnswer() {
			$(".w_charu li").each(function (i) {
				answers[i].split(',').forEach(a => {
					$(this).find("input[value=" + a + "]").parent().css("background-color", "lightgreen");
				})
			})
		}

	},

	disableTab: function () {
		$(".w_charu li").find('label').css('background-color', '');
		this.hideMessage();
	},

	showMessage: function () {
		$(".W_fl").append("<span id='enlightenMsg'>");
		let msgSpan = $("#enlightenMsg");
		msgSpan.text("绿色为正确选项！");
		msgSpan.css({
			"color": "#0ef",
			"position": "absolute",
			"margin-left": "180px",
			"display": "none"
		});
		msgSpan.fadeIn();
	},

	hideMessage: function () {
		$("#enlightenMsg").remove();
	}
}
//Event Listeners
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		switch (request.type) {
			case 'enable':
				enlightenContext.enableTab();
				break;
			case 'disable':
				enlightenContext.disableTab();
				break;
			default:
		}
	}
);

// When a page first loads, checks to see if it should enable script
chrome.extension.sendMessage({
	"type": "enable?"
});