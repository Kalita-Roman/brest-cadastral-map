module.exports.Validator = function Validator() {

	let fields = [];

	this.check = function(onIsValid, onIsNotValid) {
		let result = fields.map(x => x.check()).every(x => x);
		if(result) 
			onIsValid();
		else
			onIsNotValid();
	};

	this.get = function(f) {
		var newVal = new Val(f);
		fields.push(newVal);
		return newVal;
	}
}

let Val = function(f) {
	let _value;
	let _acceptMessage = () => { };

	this.set = function(value) {
		_value = value;
	}

	this.subscribe = function(acceptMessage) {
		_acceptMessage = acceptMessage;
	}

	this.check = function() {
		var result = f.check(_value);
		if(!result)
			_acceptMessage({message: f.message});
		return result;
	}
}

module.exports.ConditionsKit = function() {
	let conditions = Array.from(arguments);
	this.message = '';
	this.check = function(value) {
		let first = conditions.find(x => !x.check(value));
		if(!first) return true;
		this.message = first.message;
		return false;
	}
}

module.exports.fillField = {
	check(value) { return value !== '' },
	message: 'Заполните поле.'
}

module.exports.selectField = {
	check(value) { return value&&(value !== 0) },
	message: 'Выберите значение.'
}