module.exports = function(newData, oldData, _name, defualt) {
	
	newData[_name] = oldData && oldData[_name]
		? oldData[_name]
		: defualt;

	this.name = _name;

	this.set = function(value) {
		newData[_name] = value;
	}

	this.get = function() {
		return newData[_name];
	}
}