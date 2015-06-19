module.exports = function (io){
	io.on('connection', function(socket){

		socket.emit('update', "You are now connected!");
		
		socket.on('chat message', function(id,msg){
			socket.broadcast.to(id).emit('chat message', msg);
		});

		socket.on('create', function(room){
			socket.join(room);
		});

		socket.on('typing', function(name, room){
			if(name == false){
				socket.broadcast.to(room).emit('isTyping', false, {id:socket.id});
			} else
				socket.broadcast.to(room).emit('isTyping', true, {name:name, id:socket.id});
		});
	});
}