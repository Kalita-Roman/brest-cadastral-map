var subscribers = new Map();

function onSubscribe(req, res) {
	var id = Math.random();

	res.setHeader('Content-Type', 'text/plain;charset=utf-8');
	res.setHeader("Cache-Control", "no-cache, must-revalidate");

	subscribers.set(id,res);

	req.on('close', function() {
		subscribers.delete(id);
	});
}

function publish(data) {
	subscribers.forEach(x => {
    	x.end('');	
	});
  	subscribers.clear();
}


module.exports = { onSubscribe, publish };