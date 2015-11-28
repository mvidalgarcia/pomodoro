function updateRangeOutput(minutes) {
	$("#currentTaskMinutes").html(minutes)
}

function startTask() {
	if (!$("#taskName").val())
		alert("Task name!")
	else {
		$("#taskForm").hide()
		$("#taskRunningForm").show()
		$("#currentTaskName").html($("#taskName").val())
		startTimer($("#taskMinutes").val())
	}
}

function startTimer(minutes) {
	if (typeof(Worker) !== undefined) {
			timerWorker = new Worker("js/timer.js")
			timerWorker.postMessage(minutes)
			timerWorker.onmessage = displayRemainingTime
	} 
	else
		window.alert("Browser does not support workers :(")
}

function displayRemainingTime(e) {
	$("#remainingTime").html(e.data)
	console.info(e.data)
}

/* On load */
$(document).ready(function() {
	var timerWorker
	$("#taskRunningForm").hide()
})