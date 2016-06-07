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

			var database = this.base; // firebase.database()
			this.ref = database.ref(); // root
			var usersRef = database.ref('users');
			var adminsRef = database.ref('admin');
			var blacklistRef = database.ref('blacklist');
			var statesRef = database.ref('states');
			var countsRef = database.ref('counts');

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

		var self = this;
		this.user = new User();

		// implying firebase config is already set up
		this.login = function () {

			var provider = new firebase.auth.FacebookAuthProvider();
			firebase.auth().signInWithRedirect(provider);

			firebase.auth().getRedirectResult().then(function(result) {

				if(firebase.auth().currentUser !== null) {

					self.user.setUserData(firebase.auth().currentUser);

					// save user data?

					// set up interface to signed in user
				}
			}).catch(function(error) {
				// handle authentication errors (ex. unable to connect usign email, etc)
				console.error(error);
			});

		};

		this.logout = function () {

			// set up interface to signed out user
			firebase.auth().signOut();

		};

		this.onUserChange = function () {

			firebase.auth().onAuthStateChanged(function(authUser) {

				// user is signed in, collect info from result and show them somehow
				if (authUser) {
					self.user.setUserData(authUser);
					console.log(self.user.getUserData());
					self.user.setSignInStatus(true);

				// firebase.auth().signOut();  // sign in every page reload
				} else {
					self.user.setSignInStatus(false);
				}

			});

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