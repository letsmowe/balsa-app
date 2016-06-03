/*!
 * Mowe Balsa App Project v0.0.1 (http://letsmowe.org/)
 * Copyright 2013-2015 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/base/blob/master/LICENSE)
*/

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
			uid: this.uid,
			displayName: this.displayName,
			photoURL: this.photoURL,
			providerData: this.providerData
		};

		if (userRef)
			usersRef.child(this.uid).set(userData);
	
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
		this.isAdmin = false;
		this.isDouche = false;

	};

	return User;

})();