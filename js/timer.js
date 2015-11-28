var minutesLeft

self.onmessage = function(msg) {
	minutesLeft = msg.data
	var result = startTimer()
}

function startTimer() {
	if (minutesLeft >= 0) {
		console.info("timer.js: " + minutesLeft + " remaining")
		postMessage({finished: false, remaining: minutesLeft})
		setTimeout("startTimer()", 100)
	}
	else
		postMessage({finished: true, remaining: minutesLeft})
	minutesLeft--
}
