
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

		console.log('Welcome');

		// define the data references
		if (this.base) {

			this.usersRef = this.base.database().ref('users');

		}

		// the login
		// ...

	};

	return BalsaApp;

})();