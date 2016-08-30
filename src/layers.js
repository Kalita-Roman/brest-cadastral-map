var SetterStyle = function(opacity, _color, _colorLabel) {
	let _acceptor;

	this.color = function() {
		return _color;
	}()

	this.colorLabel = function() {
		return _colorLabel || '#000';
	}()

	// TODO: Надо разобраться. Почему? Как?
	this.currentOpacity = opacity;/* = function() {
		return _opacity;
	}();*/

	this.setAcceptor = function(acceptor) {
		acceptor(opacity);
		this._acceptor = acceptor;
	};

	this.setOpacity = function(value) {
		//opacity = value;
		this.currentOpacity = value;
		this._acceptor(value);
	};
}

var style_1 = new SetterStyle(0.7, '#f44', '#040');
var style_2 = new SetterStyle(0.7, '#55f', '#004');
var style_3 = new SetterStyle(0.7, '#4f4', '#400');

module.exports = [
    { 
        name:'Текущие объекты', 
        nameFormInput: 'Текущий объект', 
        nameTable: 'apz', 
        color: '#faa', 
        setterStyle: style_1,
        form: 'getForm_apz',
        tables: [ 'kind_building' ],
        current: false
    },
    { 
        name:'Градопаспорта', 
        nameFormInput: 'Градопаспорт', 
        nameTable: 'citypassport', 
        color: '#aaf', 
        setterStyle: style_2,
        form: 'getForm_citypassport',
        tables: [],
        current: true
    },
    { 
        name:'Выполненные геодезические работы', 
        nameFormInput: 'Выполненные геодезические работы', 
        nameTable: 'geodetic_survey', 
        color: '#afa', 
        setterStyle: style_3,
        form: 'getForm_geodetic_survey',
        tables: [],
        current: false
    }
];