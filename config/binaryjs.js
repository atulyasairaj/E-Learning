var fs = require('fs');
var shortid = require('shortid');

module.exports = function (bs){
	bs.on('connection', function(client){
		console.log('connected');
		//console.log(bs.clients);
		// Incoming stream from browsers
		client.on('stream', function(stream, meta){
			switch(meta.event){
				case 'create_course':
					console.log('Id ' + shortid.generate());
					var file = fs.createWriteStream(__dirname+ '/../public/content/' + meta.name);
    				stream.pipe(file);
    				stream.on('data', function(data){
						stream.write({rx: data.length / meta.size});
					});
					stream.on('end', function(data){
						stream.write({end: true});
					});
    				break;
    			case 'image' :
    				var file = fs.createReadStream(__dirname + '/../public' + meta.path);
    				client.send(file, {image: true});
    				break;
    			case 'video':
    				var file = fs.createReadStream(__dirname+ '/../public' + meta.path);
    				client.send(file, {video: true});
    				break;
			}			
			
		});
	});
}