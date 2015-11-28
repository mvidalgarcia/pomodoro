var minutesLeft

self.onmessage = function(msg) {
	minutesLeft = msg.data
	var result = startTimer()
}

function startTimer() {
	if (minutesLeft >= 0) {
		postMessage({finished: false, remaining: minutesLeft})
		setTimeout("startTimer()", 1000)
	}
	else
		postMessage({finished: true, remaining: minutesLeft})
	minutesLeft--
}
