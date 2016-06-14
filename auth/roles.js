module.exports = function(responce) {
	if(!responce || responce === 'false') return userVisitor;
	var result = table[responce.role];
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

const userAdmin = {
	name: 'admin',

	setMap(map) {
		map.addControls();
	},

	setСontroll(controll) {
		if(controll.setAdmin) {
			controll.setAdmin();
			return;
		}
		if(controll.setEditor)
			controll.setEditor();
	}
}

const table = {
	editor: userEditor,
	visitor: userVisitor,
	admin: userAdmin
}



