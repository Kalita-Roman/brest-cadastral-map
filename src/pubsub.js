module.exports = (function(){
	
	let actions = new Map();

	return {
		subscribe: function(nameAction, listener) {
			if(!actions.has(nameAction))
				actions.set(nameAction, { queue: [] });
			let item = actions.get(nameAction);
			item.queue.push(listener);
		},

		publish: function(nameAction, prm) {
			if(!actions.has(nameAction)) return
			let item = actions.get(nameAction);
			item.queue.forEach(x => x(prm));
		}
	};
})();



/*

module.exports PabSub = (function(){
  var topics = {};

  return {
    subscribe: function(topic, listener) {
	    // создаем объект topic, если еще не создан
	    if(!topics[topic]) topics[topic] = { queue: [] };

	    // добавляем listener в очередь
	    var index = topics[topic].queue.push(listener) -1;

		// предоставляем возможность удаления темы
		return {
			remove: function() {
				delete topics[topic].queue[index];
			}
		};
    },
    publish: function(topic, info) {
      // если темы не существует или нет подписчиков, не делаем ничего
      if(!topics[topic] || !topics[topic].queue.length) return;

      // проходим по очереди и вызываем подписки
      var items = topics[topic].queue;
      items.forEach(function(item) {
      		item(info || {});
      });
    }
  };
})();
*/