(function(lib) {
	"use strict";

	// private stores registries
	var stores = [];

	// the Dispatcher
	var Dispatcher = riot.observable();	

	Dispatcher.register = function(store) {
		stores.push(store);
	}

	Dispatcher.on("direct", function(type, data) {
		stores.forEach(function(s) {
			s.callback(type, data);
		});
	});

	// the bridge between stores and custom-tags/views
	var Controller = riot.observable();
	// a wrapper for Dispatcher.trigger, serve as ActionCreater
	Controller.direct = function(type, data) {
		Dispatcher.trigger("direct", type, data);
	}

	// export
	lib.Dispatcher = Dispatcher;
	lib.Controller = Controller;

})(window);