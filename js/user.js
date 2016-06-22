
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
			displayNameClass: 'User-display-name',
			messageInClass: 'AuthMessage AuthMessage--signed-in',
			messageOutClass: 'AuthMessage AuthMessage--signed-out',
			messageStatusInClass: 'AuthMessage-status font-light-blue',
			messageStatusOutClass: 'AuthMessage-status font-red'
		};
		
		this.viewport = parent; //its parent viewport
		this.user = {};
		this.photo = {};
		this.info = {};
		this.infoDisplayName = {};
		this.message = {}; // span display-name
		this.authMessageSignedIn = {}; // span status
		this.authMessageSignedOut = {}; // span status span required
		this.authMessageStatusIn = {}; // span status in
		this.authMessageStatusOut = {}; // span status out

		if (this.viewport) {

			this.init();

		}

	}

	/**
	 * Initialize user class, by normalizing the viewport (elements blocks)
	 */
	User.prototype.init = function () {

		this.normalize();

	};

	/**
	 * Create elements and placeholders blocks for user info
	 */
	User.prototype.normalize = function () {

		// create user element
		this.user.viewport = document.createElement('div');
		this.user.viewport.className = this.config.userClass;

		// append user element block to its parent (parent = AuthUser)
		this.viewport.appendChild(this.user.viewport);

		// create user photo element
		this.photo.viewport = document.createElement('figure');
		this.photo.viewport.className = this.config.photoClass;

		// create user info element
		this.info.viewport = document.createElement('div');
		this.info.viewport.className = this.config.infoClass;

		// append user photo and info element to User element
		this.user.viewport.appendChild(this.photo.viewport);
		this.user.viewport.appendChild(this.info.viewport);

		// create user message element
		this.message.viewport = document.createElement('div');
		this.message.viewport.className = this.config.messageClass;

		// create displayName block to hold displayName
		this.infoDisplayName.viewport = document.createElement('span');
		this.infoDisplayName.viewport.className = this.config.displayNameClass;

		// append displayName block to message element
		this.message.viewport.appendChild(this.infoDisplayName.viewport);

		// create user auth messages
		this.authMessageSignedIn.viewport = document.createElement('div');
		this.authMessageSignedIn.viewport.className = this.config.messageInClass;
		this.authMessageSignedOut.viewport = document.createElement('div');
		this.authMessageSignedOut.viewport.className = this.config.messageOutClass;

		// create user auth status messages
		this.authMessageStatusIn.viewport = document.createElement('span');
		this.authMessageStatusIn.viewport.className = this.config.messageStatusInClass;
		this.authMessageStatusIn.viewport.innerText = "Você está online";
		this.authMessageStatusOut.viewport = document.createElement('span');
		this.authMessageStatusOut.viewport.className = this.config.messageStatusOutClass;
		this.authMessageStatusOut.viewport.innerText = "Clique em 'Entrar' para fazer o login";

		// append user messages to info element block
		this.info.viewport.appendChild(this.message.viewport);

		// append auth info element blocks to info block
		this.info.viewport.appendChild(this.authMessageSignedIn.viewport);
		this.info.viewport.appendChild(this.authMessageSignedOut.viewport);

		// append auth info messages to element block
		this.authMessageSignedIn.viewport.appendChild(this.authMessageStatusIn.viewport);
		this.authMessageSignedOut.viewport.appendChild(this.authMessageStatusOut.viewport);
		
	};

	/**
	 * Return the only user data (without its fields and configs)
	 * @returns {{uid: *, displayName: *, photoURL: *, providerData: *}}
	 */
	User.prototype.getUserData = function () {

		return {
			uid: this.uid,
			displayName: this.displayName,
			photoURL: this.photoURL,
			providerData: this.providerData
		};

	};

	/**
	 * Set user object with data through the authUser param
	 *  providerData is set through setProvideData (because providerData
	 *  from authUser come with a lot of metainfo)
	 * @param authUser
	 */
	User.prototype.setUserData = function (authUser) {

		this.uid = authUser.uid;
		this.displayName = authUser.displayName;
		this.photoURL = authUser.photoURL;
		this.providerData = this.setProviderData(authUser.providerData);
		this.isSignedIn = false;

		var usersRef = firebase.database().ref('users');

		usersRef.child(this.uid).update({uid: this.uid});

	};

	/**
	 * Check if providerData (provided by authUser authentication) exists,
	 *  if so, returns only the first position of the result array
	 * @param providerData
	 * @returns {*}
	 */
	User.prototype.setProviderData = function (providerData) {
		
		if (providerData.length)
			return providerData[0];

		return null;
	};

	/**
	 * Set users' sign in status (true or false), more for maintenability
	 *  than for usability
	 * @param status
	 */
	User.prototype.setSignInStatus = function (status) {

		(status == true) ? this.isSignedIn = true : this.isSignedIn = false;

	};

	/**
	 * Function responsible to save (push, update, set) user info on firebase
	 *  Uid is persisted separated on setUserData, that way it is splited on two
	 *  connections, if one is blocked, the other one is persisted
	 */
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

	return User;

})();