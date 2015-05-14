(function (window) {
	'use strict';

	// id helper
	function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	}

	// the stores
	var TodoStores = function(todos) {
		this.todos = todos || [];
		this.name = "todos";
	}

	TodoStores.prototype = {
		changed: function() {
			localStorage.setItem("MY_TODO_STORAGE", JSON.stringify(this.todos));
			Controller.trigger(this.name, this.todos.slice());
		},
		callback: function(type, data) {
			switch (type) {
				case "todo_add":
					var title = data.title;
					this.todos.push({ id: guid(), title: title, completed: false});
					this.changed();
					break;
				case "todo_remove":
					var id = data.id;
					this.todos = this.todos.filter(function(t) {
						return t.id != id;
					});
					this.changed();
					break;
				case "todo_removeSome":
					var ids = data.ids;
					this.todos = this.todos.filter(function(t) {
						return !ids.some(function(id) {
							t.id == id;
						});						
					});
					this.changed();
					break;
				case "todo_clearCompleted":
					this.todos = this.todos.filter(function(t) {
						return !t.completed;					
					});
					this.changed();
					break;
				case "todo_toggle":
					var id = data.id;
					this.todos.forEach(function(t) {
						if (t.id == id)
							t.completed = !t.completed;
					});
					this.changed();
					break;
				case "todo_toggleAll":
					var completed = data.completed;
					this.todos.forEach(function(t) {
						t.completed = completed;
					});
					this.changed();
					break;
				case "todo_edit":
					var id = data.id;
					var title = data.title;
					this.todos.forEach(function(t) {
						if (t.id == id)
							t.title = title;
					});
					this.changed();
					break;
				case "todo_get":
					Controller.trigger(this.name, this.todos.slice());
					break;
				default:
					console.log("Do nothing for action " + type);
					break;
			}
		}
	}

	var my_todos = new TodoStores(JSON.parse(localStorage.getItem("MY_TODO_STORAGE") || '[]'));
	Dispatcher.register(my_todos);

	// routing, consider it another store (handled by browser & Riot)
	// thus no need to register
	riot.route(function(dummy, state) {
		Controller.trigger("routing", state);
	});

	// Your starting point. Enjoy the ride!
	var my_todos_tag = riot.mount('my-todo');

})(window);
