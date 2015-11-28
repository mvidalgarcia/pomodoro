var minutesLeft

self.onmessage = function(msg) {
	minutesLeft = msg.data
	alert(minutesLeft)
	var result = startTimer()
	postMessage(result)
}

function startTimer() {
	minutesLeft--
	console.info("timer.js: " + minutesLeft + " remaining");
	postMessage(minutesLeft);
	setTimeout("startTimer()", 100);
}