
/* User management class */

var User = (function () {

	/**
	 * User management class constructor
	 * @param {Element} parent parent element viewport (user parent element = AuthUser)
	 * @constructor
	 */
	function User (parent) {

		this.uid = '';
		this.displayName = '';
		this.photoURL = '';
		this.providerData = '';

		this.config = {
			userClass: 'User',
			photoClass: 'UserPhoto',
			infoClass: 'User-info',
			messageClass: 'UserMessage',
			messageInClass: 'AuthMessage AuthMessage--signed-in font-light-blue',
			messageOutClass: 'AuthMessage AuthMessage--signed-out font-red',
			messageStatusClass: 'AuthMessage-status'
		};
		
		this.viewport = parent; //its parent viewport
		this.user = {};
		this.photo = {};
		this.info = {};
		this.message = {}; // span display-name
		this.authMessageSignedIn = {}; // span status
		this.authMessageSignedOut = {}; // span status span required
		this.authMessageStatus = {};

		if (this.viewport) {

			this.init();

		}

	}
	
	User.prototype.init = function () {

		this.normalize();

	};
	
	User.prototype.normalize = function () {

		// create user element
		this.user.viewport = document.createElement('div');
		this.user.viewport.className = this.config.userClass;

		this.viewport.appendChild(this.user.viewport);

		// create user photo element
		this.photo.viewport = document.createElement('figure');
		this.photo.viewport.className = this.config.photoClass;

		// create user info element
		this.info.viewport = document.createElement('div');
		this.info.viewport.className = this.config.infoClass;

		this.user.viewport.appendChild(this.photo.viewport);
		this.user.viewport.appendChild(this.info.viewport);

		// create user message element
		this.message.viewport = document.createElement('div');
		this.message.viewport.className = this.config.messageClass;

		// create user auth messages
		this.authMessageSignedIn.viewport = document.createElement('div');
		this.authMessageSignedIn.viewport.className = this.config.messageInClass;

		this.authMessageSignedOut.viewport = document.createElement('div');
		this.authMessageSignedOut.viewport.className = this.config.messageOutClass;

		this.authMessageStatus.viewport = document.createElement('span');
		this.authMessageStatus.viewport.className = this.config.messageStatusClass;
		this.authMessageStatus.viewport.innerText = "Clique em 'Entrar' para fazer o login";

		this.info.viewport.appendChild(this.message.viewport);
		this.info.viewport.appendChild(this.authMessageSignedIn.viewport);
		this.info.viewport.appendChild(this.authMessageSignedOut.viewport);

		this.authMessageSignedIn.viewport.appendChild(this.authMessageStatus.viewport);
		this.authMessageSignedOut.viewport.appendChild(this.authMessageStatus.viewport);
		
	};
	
	User.prototype.setProviderData = function (providerData) {
		
		if (providerData.length)
			return providerData[0];

	};

	User.prototype.setSignInStatus = function (status) {

		(status == true) ? this.isSignedIn = true : this.isSignedIn = false;

	};
	
	User.prototype.save = function () {

		var userData = {
			displayName: this.displayName,
			photoURL: this.photoURL,
			providerData: this.providerData
		};

		var usersRef = firebase.database().ref('users');

		if (usersRef) {
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

		var usersRef = firebase.database().ref('users');
		
		usersRef.child(this.uid).update({uid: this.uid});

	};

	return User;

})();