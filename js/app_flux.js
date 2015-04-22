(function (window) {
	'use strict';

	window.Dispatcher = riot.observable();
	// should consider it private later
	Dispatcher.stores = [];

	Dispatcher.register = function(store) {
		this.stores.push(store);
	}

	Dispatcher.on("direct", function(type, data) {
		this.stores.forEach(function(s) {
			s.callback(type, data);
		});
	});

	window.Controller = riot.observable();	// just a bridge between stores and custom-tags/views

	// the stores
	var TodoStores = function() {
		this.todos = [];
		this.count = 0;	// for assign ids to todos
		this.name = "todos";
	}

	TodoStores.prototype = {
		callback: function(type, data) {
			switch (type) {
				case "todo_add":
					var title = data.title;
					this.todos.push({ id: this.count, title: title, completed: false});
					Controller.trigger(this.name, this.todos.slice());
					this.count++;
					break;
				case "todo_remove":
					var id = data.id;
					this.todos = this.todos.filter(function(t) {
						return t.id != id;
					});
					Controller.trigger(this.name, this.todos.slice());
					break;
				case "todo_removeSome":
					var ids = data.ids;
					this.todos = this.todos.filter(function(t) {
						return !ids.some(function(id) {
							t.id == id;
						});						
					});
					Controller.trigger(this.name, this.todos.slice());
					break;
				case "todo_clearCompleted":
					this.todos = this.todos.filter(function(t) {
						return !t.completed;					
					});
					Controller.trigger(this.name, this.todos.slice());
					break;
				case "todo_toggle":
					var id = data.id;
					this.todos.forEach(function(t) {
						if (t.id == id)
							t.completed = !t.completed;
					});
					Controller.trigger(this.name, this.todos.slice());
					break;
				case "todo_toggleAll":
					var completed = data.completed;
					this.todos.forEach(function(t) {
						t.completed = completed;
					});
					Controller.trigger(this.name, this.todos.slice());
					break;
				case "todo_edit":
					var id = data.id;
					var title = data.title;
					this.todos.forEach(function(t) {
						if (t.id == id)
							t.title = title;
					});
					Controller.trigger(this.name, this.todos.slice());
					break;
				default:
					console.log("Do nothing for action " + type);
					break;
			}
		}
	}

	var my_todos = new TodoStores();
	Dispatcher.register(my_todos);

	// routing, consider it another store (handled by browser & Riot)
	// thus no need to register
	riot.route(function(dummy, state) {
		Controller.trigger("routing", state);
	});

	// Your starting point. Enjoy the ride!
	var my_todos_tag = riot.mount('my-todo');

})(window);
