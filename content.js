var enlightenContext = {
	enableTab: function () {
		let answers = [];
		let answerIndex = 0;

		let questionindex = 0;
		let questionLi = $(".w_charu li");
		let length = questionLi.length;
		// display message
		$(".W_fl").append("<span id='divMsg' style='position:  absolute;margin-left: 180px;display: none;' >");
		let msgDiv = $("#divMsg");
		msgDiv.text("带有绿色边框的是正确选项！");
		msgDiv.css({
			"color": "#0ef"
		});
		msgDiv.fadeIn();
		// get answer
		$.ajax({
			type: 'POST',
			url: 'http://xxjs.dtdjzx.gov.cn/quiz-api/game_info/lookBackSubject',
			data: {
				roundOnlyId: JSON.parse(localStorage.w_allHuiKan2).data.roundOnlyId
			},
			dataType: "json",
			success: function (res) {
				let data = res.data.dateList;
				var str = '';
				if (res.code == 200 && data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						answers.push(data[i].answer);
					}
					showAns();
				} else {
					console.log(`roundOnlyId错误！`);
				}
			}
		})
		// display correct answer
		function showAns() {
			if (questionindex < length) {
				// console.log(questionindex);
				var e = questionLi[questionindex++];
				getAns(e);
			}
		}

		function getAns(e) {
			let thisAnswer = answers[answerIndex++];
			// console.log(thisAnswer.toString());
			let ans = thisAnswer.split(',');
			ans.forEach(a => {
				$(e).find("input[value=" + a + "]").parent().css("border", "2px solid green");
			});
			showAns();
		}

	},
	disableTab: function () {
		let questionLi = $(".w_charu li");
		questionLi.find('label').css('border', '');
		let msgDiv = $("#divMsg");
		msgDiv.remove();
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