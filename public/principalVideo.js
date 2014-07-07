//Gestión video principal

function cambiarAModoPrincipal(){
	socket.emit("wantToBePrincipal", {name:nombre});
	var divTemp = document.getElementById("myVideo");
	if(divTemp.hasChildNodes()){
		var i = 0;
		for(i;i < divTemp.children.length; i++){
			divTemp.children[i].style.display="none";
		}
		localStream.show("myVideo");
	}else{
		localStream.show("myVideo");
	}

	
}

socket.on("wantToBePrincipal", function(data){
	var divTemp = document.getElementById("myVideo");
	if(divTemp.hasChildNodes()){
		var i = 0;
		for(i;i < divTemp.children.length; i++){
			divTemp.children[i].style.display="none";
		}
	
		var streamNew = room.getStreamsByAttribute('name', data.name);
		streamNew[0].show("myVideo");
	}else{
		var streamNew = room.getStreamsByAttribute('name', data.name);
		streamNew[0].show("myVideo");
	}



});