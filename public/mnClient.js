

var lo1 = "background-color:#333388; top:150px; margin: 5px; width:150px; height:150px; float: left;";
var lo2 = "background-color:#338833; bottom: 150px; margin: 5px; width:150px; height:150px; float: right;";
var los = "width:100%; height:200px; position: absolute: bottom: 0; margin: auto;";

var layoutGeneral = 0;
var idVid;
var modoGeneral;
var rolGeneral = "otro"; //Puede ser "principal", "secundario", "otro"
var lockState = "open"; //Puede ser "open", "closed" o "closedByMe"
var streamPrincipal;
var principalNow = nombre;


function enviaChat(){
	var txt = document.getElementById("txtChat").value;
	socket.emit('chat', { msg: txt, from: nombre });
	document.getElementById("chatArea").value += "\nYou > " + txt;
	document.getElementById("txtChat").value = "";
}

//SOCKET

//Gestiona cambio de layout
socket.on('cambialayout', function(data){
	console.log(data);
	layoutGeneral = data.layout;
	if(layoutGeneral=='1')
		toLayout1();
	else if(layoutGeneral=='2')
		toLayout2();
	else
		toLayout3();
});


//Gestiona entrada de mensajes de chat
socket.on('mens', function(data){
	console.log("Mensaje recibido: " + data.mens);
	document.getElementById("chatArea").value += "\n      " + data.from + " > " + data.mens;
});


/***********Videos YouTube***********/

socket.on('stop_yt', function(){
	console.log("Stop Video");
	player.stopVideo();
});

socket.on('pause_yt', function(){
	console.log("Pause Video");
	player.pauseVideo();
});

socket.on('play_yt', function(){
	console.log("Play Video");
	player.playVideo();
});

function appearSS(){
	document.getElementById("hideShowControl").style.display='none';
	document.getElementById("ss").style.display = 'block';
	loadPlayer();
}


/*********** SlideShare ***********/

var flashMovie;

//Load the flash player. Properties for the player can be changed here.
function loadPlayer() {
    //allowScriptAccess from other domains
    var params = { allowScriptAccess: "always" };
    var atts = { id: "player" };

    //doc: The path of the file to be used
    //startSlide: The number of the slide to start from
    //rel: Whether to show a screen with related slideshows at the end or not. 0 means false and 1 is true..
    var flashvars = { doc : "road-to-a-collaborative-culture-redbooth-140331162445-phpapp02", startSlide : 1, rel : 0 };

    //Generate the embed SWF file
    swfobject.embedSWF("http://static.slidesharecdn.com/swf/ssplayer2.swf", "playerSS", "518", "95%", "8", null, flashvars, params, atts);

    //Get a reference to the player
    flashMovie = document.getElementById("playerSS");
}

//Jump to the appropriate slide
function jumpTo(){
        flashMovie.jumpTo(parseInt(document.getElementById("slidenumber").value));
}

//Update the slide number in the field for the same
function updateSlideNumber(){
        document.getElementById("slidenumber").value = flashMovie.getCurrentSlide();
}





function slideshareMode(){

}

function emitPrincipalRol(){
	//socket.emit('principalRol');
	toPrincipalRol();
}

function toPrincipalRol(){
	if(principalNow == nombre){
		socket.emit('wannabePrincipal', {name:nombre, id:idStream});
		document.getElementById("principalRolBtn").disabled=true;
	}else{
		document.getElementById("myVideo").innerHTML="";
		socket.emit('wannabePrincipal', {name:nombre, id:idStream});
		document.getElementById("principalRolBtn").disabled=true;
		localStream.show("myVideo");
		document.getElementById("videoAux").innerHTML="";
	}
}

function toggleLockPrincipalRol(){
	if(lockState == "open"){
		document.getElementById("imgLock").setAttribute("src", "images/closed.png");
		toPrincipalRol();
		lockState = "closedByMe";
		socket.emit('lockClosed');
	}else if(lockState == "closedByMe"){
		document.getElementById("imgLock").setAttribute("src", "images/open.png");
		document.getElementById("principalRolBtn").disabled=false;
		lockState ="open";
		socket.emit('lockOpen');
	}else{
		$("#cannotOpenLock").show();
		//alert("No puedes abrir el cerrojo.");
	}
}

function secondaryRol(){

}

socket.on('newPrincipal',function(data){
	var principalName = data.name;
	var principalId = data.id;
	changeToPrincipal(principalName, principalId);
	document.getElementById("principalRolBtn").disabled=false;
});

function changeToPrincipal(principalName, principalId){
	/*var idPrincipalDiv = "player_" + principalId;
	var idLocalDiv = "player_" + idStream;
	document.getElementById("player_undefined").setAttribute('id', idLocalDiv);
	//alert(principalName + " quiere ser principal");
	document.getElementById("toPrincipalName").innerHTML = principalName;
    $("#toPrincipal").show();
    //var divPrincipal = document.getElementById("videoDestacado");
    //alert("MAO");
    var streamToPrincipal = room.getStreamsByAttribute('name', principalName);
    //streamToPrincipal[0].hide();
    streamToPrincipal[0].show("myVideo", {});

//    localStream.hide();
    document.getElementById(idLocalDiv).setAttribute('style', 'display:none;');
    var miNuevoDiv = document.createElement('div');
    miNuevoDiv.setAttribute("style", "width: 45%; height: 120px; margin: 2%; float:left; margin-top:9%;");
    var nombreUsuario = document.createElement('div');
    nombreUsuario.setAttribute("id", "nombreUsuario");
    nombreUsuario.innerHTML = "<p style=\"margin-bottom:0px;\" class=\"text-center\">" + nombre + "</p>";
    miNuevoDiv.appendChild(nombreUsuario);
    miNuevoDiv.setAttribute("id", "" + idStream);
    document.getElementById("otrosVideos").appendChild(miNuevoDiv);
    localStream.show(idLocalDiv, {});*/
	localStream.show("videoAux");
    document.getElementById("myVideo").innerHTML = "";
    //localStream.hide();

    var streamNewPrincipal = room.getStreamsByAttribute('name', principalName);
    //streamNewPrincipal[0].hide();
    streamPrincipal = streamNewPrincipal;
    streamNewPrincipal[0].show("myVideo");
    principalNow = principalName;
}


//Gestiona el candado de Principal
socket.on('lockOpen', function(){
	document.getElementById("principalRolBtn").disabled=false;
	document.getElementById("imgLock").setAttribute("src", "images/open.png");
	lockState="open";
});

socket.on('lockClosed', function(){
	document.getElementById("principalRolBtn").disabled=true;
	document.getElementById("imgLock").setAttribute("src", "images/closed.png");
	lockState="closed";

});

function openLock(){
	//Meter el contenido de arriba
}

function closeLock(){

}

socket.on('updateListaNombres', function(data){
	updateListaNombres(data.names);
	
});

function updateListaNombres(listadenombres){
	var lista = new Array();
	lista = listadenombres.split("*");
	var cmd ="";
	var i;
	for(i = 0; i < lista.length-1; i++){
		cmd += "<li><i class=\"icon-user\"></i> " + lista[i] + "</li>";
	}
	document.getElementById("listaParticipantes").innerHTML = cmd;
}

socket.on('userRemoved', function(){
	socket.emit('getListaNombres');
});

function changeImgAcordion(){
	var a = document.getElementById('imgAcordion');
	if(a.getAttribute("class") == "icon-chevron-down")
		a.setAttribute("class", "icon-chevron-up");
	else
		a.setAttribute("class", "icon-chevron-down");
}

function changeToBlackboardMode(){
	socket.emit("blackboardMode");
}

socket.on('blackboardMode', function(){
	document.getElementById("activeBlackboard").setAttribute("class", "active");
	document.getElementById("activeYouTube").setAttribute("class", "");
	document.getElementById("tab1").setAttribute("class", "tab-pane active");
	document.getElementById("tab2").setAttribute("class", "tab-pane");
});
