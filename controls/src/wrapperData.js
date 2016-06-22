module.exports = function(newData, oldData, _name, defualt, flag) {

	let setNewData = function() {
		if(!newData) return;
		newData[_name] = currentValue;
	}
	
	let currentValue = oldData && oldData[_name]
		? oldData[_name]
		: defualt;

	if(flag)
		setNewData();

	this.name = _name;


	this.set = function(value) {
		currentValue = value;
		setNewData();
	}

	this.get = function() {
		return currentValue;
	}
}