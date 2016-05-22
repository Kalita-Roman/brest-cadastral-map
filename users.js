module.exports.getUser = function(responce) {
	if(!responce || responce === 'false') return userVisitor;
	responce = JSON.parse(responce);
	return table[responce.type];
}

const userVisitor = {
	name: 'visitor',

	setMap(map) {
		map.removeControls();
	},

	setСontroll(controll) {
		controll.setVisitor();
	}
}

const userEditor = {
	name: 'editor',

	setMap(map) {
		map.addControls();
	},

	setСontroll(controll) {
		controll.setEditor();
	}
}

const table = {
	editor: userEditor,
	visitor: userVisitor
}



