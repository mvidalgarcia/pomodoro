var timerWorker
var timerType

/*
 * Task form
 */
function startTask() {
	var taskName = $("#taskName").val(),
			taskMinutes = $("#taskMinutes").val()
	if (!taskName)
		alert("Enter a task name!")
	else if (repeatedTaskName(taskName))
		alert("Task name repeated! Try with a different one")
	else {
		$("#taskForm").hide()
		$("#taskRunningForm").show()
		$("#currentTaskName").html(taskName)
		$(".toBreakOrWork").prop('disabled', true)
		timerType = "task"
		saveTask(taskName, taskMinutes)
		showPriorTasks()
		startTimer(taskMinutes)
	}
}

function saveTask(name, minutes) {
	if (storageAvailable('localStorage')) {
		var today = new Date(),
				dd = today.getDate(),
				mm = today.getMonth()+1,
				yyyy = today.getFullYear(),
				currentDate = dd+'/'+mm+'/'+yyyy
		var h = today.getHours(),
				m = today.getMinutes(),
				s = today.getSeconds(),
				currentTime = h + ":" + m + ":" + s

		localStorage.setItem(name, currentDate+"\t"+currentTime+"\t"+minutes)
	}
	else {
		window.alert("Browser does not support localStorage :(")
	}
}

function showPriorTasks() {
	var keys = Object.keys(localStorage),
      i = keys.length;

	$("#priorTasks").empty()
	while ( i-- ) {
		$("#priorTasks").append("<li><strong>"+keys[i]+": </strong>"+localStorage.getItem(keys[i]) +"</li>")
	}
}

function repeatedTaskName(name) {
	var keys = Object.keys(localStorage)
	return $.inArray(name, keys) > -1
}

/*
 * Task/Break running
 */
 function updateRangeOutput(minutes) {
 	$(".currentMinutes").html(minutes)
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
	updateRangeOutput(5)
	$("#breakMinutes").val(5)
}

function startBreak() {
	$("#breakForm").hide()
	$("#breakRunningForm").show()
	$(".toBreakOrWork").prop('disabled', true)
	timerType = "break"
	startTimer($("#breakMinutes").val())
}

function backToWork() {
	$("#breakRunningForm").hide()
	$("#taskForm").show()
	updateRangeOutput(25)
	$("#taskMinutes").val(25)
}

/* On load */
$(document).ready(function() {
	$("#taskRunningForm").hide()
	$("#breakForm").hide()
	$("#breakRunningForm").hide()
})

/*
 * Utils
*/
function storageAvailable(type) {
	try {
		var storage = window[type],
				x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}
