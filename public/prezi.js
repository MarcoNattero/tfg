var idPrezi;
var pP;
var playerPrezi;

function loadPrezi(){
	//idVid = prompt("Pega aquí la URL del vídeo (YouTube)");
	idPrezi = document.getElementById("idPrezi").value;
	if(idPrezi == "" || idPrezi == null){
		$("#idPreziAlert").show();
		return;
	}
	//ytModeRender();
	//socket.emit('youtubeMode', {id:idVid});
	//ytVideoLoader();
	socket.emit('preziMode', {id:idPrezi});
	preziRender();
	preziLoader(idPrezi);
}

function preziRender(){
	document.getElementById("idInputPrezi").setAttribute("style", "display:none;");
	document.getElementById("prezi").setAttribute("style", "display:block; margin-top:0px;");
}

function preziLoader(id){
	playerPrezi = new PreziPlayer('prezi-player', {
    	'preziId' : id,
    	explorable: true
	});

	player.on(PreziPlayer.EVENT_STATUS, function(event) {
	    if (event.value == PreziPlayer.STATUS_CONTENT_READY) {
	        //document.getElementById("btnNextPrezi").disabled=false;
	        //document.getElementById("btnPrevPrezi").disabled=false;
	        
	    }
	});

	pP = playerPrezi;
}

function showPreziDiv(){
	document.getElementById("activeBlackboard").setAttribute("class", "");
	document.getElementById("activeYouTube").setAttribute("class", "");
	document.getElementById("activePrezi").setAttribute("class", "active");
	document.getElementById("tab1").setAttribute("class", "tab-pane");
	document.getElementById("tab2").setAttribute("class", "tab-pane");
	document.getElementById("tab3").setAttribute("class", "tab-pane active");
}

function nextStep(){
	socket.emit('preziNextStep');
	playerPrezi.flyToNextStep();
}

function prevStep(){
	socket.emit('preziPrevStep');
	playerPrezi.flyToPreviousStep();
}

socket.on('preziNextStep', function(){
	playerPrezi.flyToNextStep();
});

socket.on('preziPrevStep', function(){
	playerPrezi.flyToPreviousStep();
});

socket.on('preziMode', function(data){
	showPreziDiv();
	preziRender();
	preziLoader(data.id);
});