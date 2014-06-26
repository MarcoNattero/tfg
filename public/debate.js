var moderatorPrincipal = "[name]";

function loadDebate(){
	/*var loadDebate = confirm("¿Seguro que quieres iniciar un debate?")
	if (loadDebate == true){
		loadDebateView();
	}*/
	loadDebateView();
}

function loadDebateView(){
	document.getElementById("supMenuIndex").setAttribute("class", "");
	document.getElementById("supMenuDebate").setAttribute("class", "active");
	document.getElementById("moduleArea").style.display="none";
	document.getElementById("chronoArea").style.display="block";
	document.getElementById("debateControlPanel").style.display="block";
	moderatorPrincipal = nombre;
	viewChrono();
	sendDebateCall();
		socket.emit('getListaNombres');
}

function sendDebateCall(){
	document.getElementById("moderatorName").innerHTML="Moderator: <bold>" + moderatorPrincipal + "</bold>";
	var startTime = document.getElementById("durationDebate").value;
	socket.emit("debateNow", {moderator: moderatorPrincipal, startTime: startTime});
}

//TIMER
var counter;

function startTimer(){
	counter=setInterval(timer,1000);
	document.getElementById("btnStartTimer").innerHTML="Stop Timer";
	document.getElementById("btnStartTimer").setAttribute("onclick", "javascript:stopTimer();");
	sendStartTimers();
}

function stopTimer(){
	clearInterval(counter);
	document.getElementById("btnStartTimer").innerHTML="Start Timer";
	document.getElementById("btnStartTimer").setAttribute("onclick", "javascript:startTimer();");
	sendStopTimers();
}

function resetTimer(){
	count = document.getElementById("durationDebate").value;
	stopTimer();
	viewChrono();
	sendResetTimers();
}

var count = document.getElementById("durationDebate").value;

function timer()
{  
  count=count-1;
  if (count <= 0)
  {
     clearInterval(counter);
     //counter ended, do something here
     return;
  }

  document.getElementById("timer").innerHTML = "<bold>" + count + "</bold>" + " secs";
}

function updateDebateDuration(){
	count = document.getElementById("durationDebate").value;
	resetTimer();
	sendUpdateTimers();
}

function viewChrono(){
	document.getElementById("timer").innerHTML = "<bold>" + count + "</bold>" + " secs";
}

socket.on('debateNow', function(data){
	document.getElementById("moderatorNameAlert").innerHTML=data.moderator;
	$("#newModerator").show();
	//alert("el moderador es: " + data.moderator + data.startTime);
	moderatorPrincipal = data.moderator;
	count = data.startTime;
	changeToDebateMode();
});

function changeToDebateMode(){
	document.getElementById("supMenuIndex").setAttribute("class", "");
	document.getElementById("supMenuDebate").setAttribute("class", "active");
	document.getElementById("moduleArea").style.display="none";
	document.getElementById("chronoArea").style.display="block";
	viewChrono();
	
	document.getElementById("moderatorName").innerHTML = "Moderator: <bold>" + moderatorPrincipal + "</bold>";
}

function sendStartTimers(){
	time=document.getElementById("durationDebate").value;
	socket.emit("startTimers", {startTime: time});
}

function sendStopTimers(){
	socket.emit("stopTimers");
}

function sendResetTimers(){
	socket.emit("resetTimers");
}

function sendUpdateTimers(){
	var newTime = document.getElementById("durationDebate").value;
	socket.emit("updateTimers", {newTime: newTime})
}

socket.on("startTimers", function(data){
	counter=setInterval(timer,1000);
	//count=data.startTime;
	document.getElementById("btnStartTimer").innerHTML="Stop Timer";
	document.getElementById("btnStartTimer").setAttribute("onclick", "javascript:stopTimer();");
});

socket.on("stopTimers", function(){
	clearInterval(counter);
	document.getElementById("btnStartTimer").innerHTML="Start Timer";
	document.getElementById("btnStartTimer").setAttribute("onclick", "javascript:startTimer();");
});

socket.on("resetTimers", function(){

});

socket.on("updateTimers", function(data){
	count = data.newTime;
	stopTimer();
	viewChrono();
});

socket.on("updateListaNombres", function(data){
	var listaNombres = data.names;

	var lista = new Array();
	lista = listaNombres.split("*");
	var cmd ="";
	var i;
	for(i = 0; i < lista.length-1; i++){
		cmd += "<option>" + lista[i] + "</option>";
	}
	document.getElementsByClassName("selectNamesList")[0].innerHTML = cmd;
});