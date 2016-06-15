
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

		var login = this.viewport.querySelectorAll('.Button--login')[0];
		var logout = this.viewport.querySelectorAll('.Button--logout')[0];
		var status = this.viewport.querySelectorAll('.AuthMessage-status')[1];

		login.addEventListener('click', function () {

			if (self.base.auth().currentUser == null) {

				// status.innerText = "Fazendo login...";
				// setTimeout(self.auth.login(), 1000);
				self.auth.login();

			}

		});

		logout.addEventListener('click', function () {

			if (self.base.auth().currentUser !== null) {
				self.auth.logout();
			}

		});

	};

	return BalsaApp;

})();