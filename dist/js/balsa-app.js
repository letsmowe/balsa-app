/*!
 * Mowe Balsa App Project v0.0.1 (http://letsmowe.org/)
 * Copyright 2013-2015 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/base/blob/master/LICENSE)
*/

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

/* Balsa App Auth */

var Auth = (function () {

	/**
	 * Balsa App Auth constructor
	 * @constructor
	 */
	function Auth() {

		var self = this;
		this.user = new User();

		// implying firebase config is already set up
		this.login = function () {

			if (!firebase.auth().currentUser) {

				var provider = new firebase.auth.FacebookAuthProvider();
				firebase.auth().signInWithRedirect(provider);

				firebase.auth().getRedirectResult().then(function (result) {

					if (firebase.auth().currentUser == null) {
						// go to facebook authentication page, therefore, set online true
						localStorage.setItem('online', true);
					}

				}).catch(function (error) {
					console.error(error);
				});

			}

		};

		this.logout = function () {
			console.log('called logout func');

			// set up interface to signed out user
			firebase.auth().signOut();
			localStorage.removeItem('online');

			self.setLoggedOutInfo();

			var info = document.querySelectorAll('.Info');
			for (var i = info.length; i--;)
				(info[i].classList.contains('is-online')) ? info[i].classList.remove('is-online') : null;

		};

		this.onUserChange = function () {
			console.log('called OnUserChange');

			firebase.auth().onAuthStateChanged(function(authUser) {

				// user is signed in, collect info from result and show them somehow
				if (authUser) {
					console.log('authUser true @ onAuthStateChange');

					self.user.setUserData(authUser);
					self.user.setSignInStatus(true);
					self.setLocalStorage();

					if (self.user.getUserData().uid == self.getLocalStorage().user.uid) {
						self.setLoggedInInfo();
						console.log(self.user.getUserData().uid);
					} else {
						console.log('First time user logged in');
					}

				} else {
					console.log('authUser false @ onAuthStateChange');

					self.user.setSignInStatus(false);

					// for firebase, user is off, but for localstorage, he is on
					if (localStorage.getItem('auth') && localStorage.getItem('online')) {
						self.setLoggedInInfo();
					}
				}
			});

			if (localStorage.getItem('online')) {
				document.getElementsByClassName('User-state')[0].textContent = 'Online';
				self.displayInfo();
			}

		};

	}

	// WARNING: wont work, user is created using setUserData and retrive data using getUserData
	Auth.prototype.getUser = function () {

		return this.user;

	};

	Auth.prototype.displayInfo = function () {

		var infoFields = document.querySelectorAll('.Info');
		for (var i = 0; i < infoFields.length; i++)
			infoFields[i].classList.toggle('is-online');

	};

	Auth.prototype.setLocalStorage = function () {

		var str = JSON.stringify(this);
		localStorage.setItem('auth', str);

	};

	Auth.prototype.getLocalStorage = function () {

		var storedData = localStorage.getItem('auth');
		storedData = JSON.parse(storedData);

		return storedData;

	};

	Auth.prototype.getInfoFields = function () {

		var uid = document.getElementsByClassName('User-uid')[0];
		var name = document.getElementsByClassName('User-name')[0];
		var photo = document.getElementsByClassName('User-photo')[0];

		var fields = {0: uid, 1: name, 2: photo};
		
		return fields;

	};

	Auth.prototype.setLoggedInInfo = function () {

		var info = this.getInfoFields();
		var storedData;

		if (localStorage.length) {

			storedData = this.getLocalStorage();

			info[0].textContent = storedData.user.uid;
			info[1].textContent = storedData.user.displayName;
			info[2].textContent = storedData.user.photoURL;

		}

	};

	Auth.prototype.setLoggedOutInfo = function () {

		var fields = this.getInfoFields();

		for (var k = 0; k < fields.length; k++)
			fields[k].textContent = "";

	};

	return Auth;

})();

/* Current */

var Current = (function () {

	/**
	 * Current constructor
	 * @constructor
	 */
	function Current() {

		this.status = {};

		this.band = {};
		this.itca = {};

	}

	return Current;

})();

/* Queue */

var Queue = (function () {

	/**
	 * Queue constructor
	 * @constructor
	 */
	function Queue() {

		this.count = 0;

		this.user = 0;
		this.isValid = true;
		this.direction = {};
		this.timestamp = 0;

	}

	return Queue;

})();

/* Status */

var Status = (function () {

	/**
	 * Status constructor
	 * @constructor
	 */
	function Status() {

		this.title = '';
		this.user = '';
		this.message = '';
		this.className = '';
		this.timestamp = '';

	}

	return Status;

})();

/* User management class */

var User = (function () {

	/**
	 * User management class constructor  constructor
	 * @constructor
	 */
	function User (userData) {

		if (userData)
			this.setUserData(userData);

	}
	
	User.prototype.setProviderData = function (providerData) {
		
		if (providerData.length)
			return providerData[0];

	};

	User.prototype.setSignInStatus = function (status) {

		(status == true) ? this.isSignedIn = true : this.isSignedIn = false;

	};
	
	User.prototype.save = function (userRef) {

		var userData = {
			displayName: this.displayName,
			photoURL: this.photoURL,
			providerData: this.providerData
		};

		if (userRef) {
			// usersRef.child(this.uid).update(userData);
		}
	};

	User.prototype.getUserData = function () {
	
		return {
			uid: this.uid,
			displayName: this.displayName,
			photoURL: this.photoURL,
			providerData: this.providerData
		};
		
	};

	User.prototype.setUserData = function (authUser) {

		this.uid = authUser.uid;
		this.displayName = authUser.displayName;
		this.photoURL = authUser.photoURL;
		this.providerData = this.setProviderData(authUser.providerData);
		this.isSignedIn = false;

		// usersRef.child(this.uid).update({uid: this.uid});

	};

	return User;

})();