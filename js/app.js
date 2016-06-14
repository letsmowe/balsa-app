
/* Balsa App */

var BalsaApp = (function () {

	/**
	 * Balsa App constructor
	 * @param {Element} viewport
	 * @param {object} base
	 * @constructor
	 */
	function BalsaApp(viewport, base) {

		this.viewport = viewport;
		this.base = base;

		this.auth = new Auth();
		this.counters = false;

		if (this.viewport && this.base) {

			this.init();

		}

	}

	/**
	 * BalsaApp instance start
	 */
	BalsaApp.prototype.init = function () {

		var self = this;
		// define the data references
		if (this.base) {

			var database = this.base.database(); // firebase.database()
			this.ref = database.ref(); // root
			var usersRef = database.ref('users');
			var adminsRef = database.ref('admin');
			var blacklistRef = database.ref('blacklist');
			var statesRef = database.ref('states');
			var countsRef = database.ref('counts');

		}

		var btn = this.viewport.querySelectorAll('#refresh')[0];
		var state = this.viewport.querySelectorAll('.User-state')[0];

		btn.addEventListener('click', function () {

			if (self.base.auth().currentUser == null) {

				state.textContent = "Fazendo login...";
				setTimeout(self.auth.login, 1000);

			} else {

				state.textContent = "Offline";
				self.auth.logout();

			}

		});

	};

	return BalsaApp;

})();