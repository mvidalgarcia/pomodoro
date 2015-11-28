var timerWorker
var timerType

/*
 * Task form
 */
function startTask() {
	if (!$("#taskName").val())
		alert("Enter a task name!")
	else {
		$("#taskForm").hide()
		$("#taskRunningForm").show()
		$("#currentTaskName").html($("#taskName").val())
		timerType = "task"
		startTimer($("#taskMinutes").val())
		console.info("New task called " + $("#taskName").val())
	}
}

/*
 * Task/Break running
 */
 function updateRangeOutput(minutes) {
 	$("#currentTaskMinutes").html(minutes)
 	$("#currentBreakMinutes").html(minutes)
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
	if (!e.data.finished)
		$(".remainingTime").html(e.data.remaining)
	else {
		timerWorker.terminate()
		if (timerType == "task")
			var n = new Notification("The task " + $("#taskName").val() + " has finished. Have a break!")
		else if (timerType == "break")
			var n = new Notification("Break has finished. It's time to work!")
    setTimeout(n.close.bind(n), 10000);
		$(".toBreakOrWork").prop('disabled', false)
	}
}

/*
 * Break form
 */
function haveABreak() {
	$("#taskRunningForm").hide()
	$("#breakForm").show()
}

function startBreak() {
	$("#breakForm").hide()
	$("#breakRunningForm").show()
	timerType = "break"
	startTimer($("#breakMinutes").val())
}

function backToWork() {
	$("#breakRunningForm").hide()
	$("#taskForm").show()
}

/* On load */
$(document).ready(function() {
	$("#taskRunningForm").hide()
	$("#breakForm").hide()
	$("#breakRunningForm").hide()
})
