var subscribers = new Map();

function onSubscribe(req, res) {
	var id = Math.random();

	res.setHeader("Cache-Control", "no-cache, must-revalidate");
	res.setHeader("Transfer-Encoding", "chunked");

	subscribers.set(id,res);
	req.on('close', function() {
		subscribers.delete(id);
	});
}

function publish(data) {
	subscribers.forEach(x => {
    	x.end(data);	
	});
  	subscribers.clear();
}


module.exports = { onSubscribe, publish };