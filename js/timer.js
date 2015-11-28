var minutesLeft

self.onmessage = function(msg) {
	minutesLeft = msg.data
	var result = startTimer()
}

function startTimer() {
	minutesLeft--
	if (minutesLeft >= -1) {
		console.info("timer.js: " + minutesLeft + " remaining")
		postMessage(minutesLeft)
		setTimeout("startTimer()", 100)
	}
}
