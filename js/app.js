
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

		this.config = {
			viewportClass: 'Balsapp',
			backgroundClass: 'Balsapp-background',
			innerClass: 'Balsapp-inner',
			stageClass: 'Balsapp-stage'
		};

		this.background = {};
		this.inner = {};
		this.stage = {};

		if (this.viewport && this.base) {

			this.init();

		}

	}

	/**
	 * Normalize the viewport
	 * Add the background and inner elements
	 */
	BalsaApp.prototype.normalize = function () {

		// normalize the viewport class
		this.viewport.classList.add(this.config.viewportClass);
		this.viewport.classList.add('is-signed-out');

		// create background element
		this.background.viewport = document.createElement('div');
		this.background.viewport.className = this.config.backgroundClass;

		// create inner element
		this.inner.viewport = document.createElement('div');
		this.inner.viewport.className = this.config.innerClass;

		// append inner and background elements to viewport
		this.viewport.appendChild(this.background.viewport);
		this.viewport.appendChild(this.inner.viewport);

		// create stage element
		this.stage.viewport = document.createElement('div');
		this.stage.viewport.className = this.config.stageClass;

		// append stage element to inner
		this.inner.viewport.appendChild(this.stage.viewport);

	};

	/**
	 * BalsaApp instance start
	 */
	BalsaApp.prototype.init = function () {

		var self = this;

		// normalize viewport
		this.normalize();

		this.auth = new Auth(this.inner.viewport);
		this.auth.onSignInStateChange = function () {
			if (self.viewport.classList.contains('is-signed-out')) {
				self.viewport.classList.remove('is-signed-out');
				self.viewport.classList.add('is-signed-in');
			}
		};
		this.auth.init();

		this.current = new Current(this.stage.viewport);

		// define the data references
		if (this.base) {

			var database = this.base.database(); // firebase.database()
			var usersRef = database.ref('users');
			var adminsRef = database.ref('admin');
			var blacklistRef = database.ref('blacklist');
			var statusRef = database.ref('status');
			var countsRef = database.ref('counts');

		}

	};

	return BalsaApp;

})();