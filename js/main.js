/*
 * Task form
 */
function updateRangeOutput(minutes) {
	$("#currentTaskMinutes").html(minutes)
}

function startTask() {
	if (!$("#taskName").val())
		alert("Enter a task name!")
	else {
		$("#taskForm").hide()
		$("#taskRunningForm").show()
		$("#currentTaskName").html($("#taskName").val())
		startTimer($("#taskMinutes").val())
		console.info("New task called " + $("#taskName").val())
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

/*
 * Task form running
 */
function displayRemainingTime(e) {
	if (e.data >= 0)
		$("#remainingTime").html(e.data)
	else {
		var n = new Notification("The task " + $("#taskName").val() + " has finished. Have a break!")
    setTimeout(n.close.bind(n), 10000);
		$("#break").prop('disabled', false)
	}
}

/* On load */
$(document).ready(function() {
	var timerWorker
	$("#taskRunningForm").hide()
})
