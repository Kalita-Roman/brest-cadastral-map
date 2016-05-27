module.exports.getUser = function(responce) {
	if(!responce || responce === 'false') return userVisitor;
	var result = table[responce.type];
	result.user = responce;
	return result;
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



