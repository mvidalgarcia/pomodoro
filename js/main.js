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

/* Inserts tasks in local storage ordered by key */
function saveTask(name, minutes) {
	if (storageAvailable('localStorage')) {
		var index = 0
		var epoch = (new Date).getTime()
		var keys = Object.keys(localStorage)
		if (keys.length != 0) {
			index = largestIndexArray(keys)
			index++
		}
		localStorage.setItem( index, JSON.stringify({timestamp: epoch, taskName: name, taskTime: minutes}) )
	}
	else {
		window.alert("Browser does not support localStorage :(")
	}
}

function showPriorTasks() {
	var indexes = Object.keys(localStorage)
	// Sort most recent first
	indexes.sort(sortNumber)
	$("#priorTasks").empty()

	$.each(indexes, function( index, value ) {
		var item = JSON.parse(localStorage.getItem(value))
		$("#priorTasks").append("<li><strong>"+item.taskName+": </strong>"+new Date(item.timestamp)+" "+item.taskTime+"</li>")
	})
}

function repeatedTaskName(name) {
	var tasks = allStorage()
	for (var i=0; i < tasks.length; i++) {
		var task = JSON.parse(tasks[i])
		if (task.taskName == name)
			return true
	}
	return false
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
	$("#taskName").html('')
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

function allStorage() {
  var values = [],
      keys = Object.keys(localStorage),
      i = keys.length

  while ( i-- ) {
      values.push( localStorage.getItem(keys[i]) )
  }

  return values
}

function largestIndexArray(array) {
	var largest = 0
	for (var i = 0; i <= array.length; i++){
		if (parseInt(array[i]) > largest)
			var largest = parseInt(array[i])
	}
	return largest
}

/* Descendant */
function sortNumber(a,b) {
    return b - a;
}
