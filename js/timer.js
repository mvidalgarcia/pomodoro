var totalSecs, minutesLeft

self.onmessage = function(msg) {
	minutesLeft = msg.data
	totalSecs = minutesLeft * 60
	var result = startTimer()
}

function startTimer() {
	if (totalSecs >= 0) {
		var secsToShow = totalSecs % 60
		var remaining = twoDigits(minutesLeft) + ':' + twoDigits(secsToShow)
		postMessage({finished: false, remaining: remaining})
		if (secsToShow == 0)
			minutesLeft--
		setTimeout("startTimer()", 1000)
	}
	else
		postMessage({finished: true, remaining: totalSecs})
	totalSecs--
}

/*
 * Utils
 */
 function twoDigits(n) {
	 return ("0" + n).slice(-2)
 }
