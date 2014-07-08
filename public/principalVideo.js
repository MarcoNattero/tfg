//Gestión video principal

function cambiarAModoPrincipal(){
	document.getElementById("myVideo").innerHTML = "";
	socket.emit("wantToBePrincipal", {name:nombre});
	localStream.show("myVideo");
}

socket.on("wantToBePrincipal", function(data){
	document.getElementById("myVideo").innerHTML = "";
	var newName = data.name;
	var newStream = room.getStreamsByAttribute("name", newName);
	newStream[0].show("myVideo");
})