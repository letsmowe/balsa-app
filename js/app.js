
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
		this.status = new Status();
		this.counters = false;

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