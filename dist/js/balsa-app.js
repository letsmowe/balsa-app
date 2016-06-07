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

/* Balsa App Auth */

var Auth = (function () {

	/**
	 * Balsa App Auth constructor
	 * @constructor
	 */
	function Auth() {

		this.user = new User();

		this.login = function () {

			// do the login

		};

		this.logout = function () {

			// do the logout

		};

		this.onUserChange = function () {



		};

	}

	Auth.prototype.getUser = function () {

		return this.user;

	};

	return Auth;

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
		(this.isSignedIn) ? console.log("Usuário online") : console.log("Usuário offline");

	};
	
	User.prototype.save = function (userRef) {

		var userData = {
			displayName: this.displayName,
			photoURL: this.photoURL,
			providerData: this.providerData
		};

		if (userRef) {
			usersRef.child(this.uid).update(userData);
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

		usersRef.child(this.uid).update({uid: this.uid});

		// console.log(this.teste);

	};

	return User;

})();