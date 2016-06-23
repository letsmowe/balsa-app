
/* Balsa App Auth */

var Auth = (function () {

	/**
	 * Balsa App Auth constructor
	 *  Auth INIT function is called on app.js
	 * @constructor
	 * @param {Element} parent parent element viewport (auth parent element = Balsapp-inner)
	 */
	function Auth(parent) {

		// Auth properties
		var self = this;
		this.onSignInStateChange = false;

		// Auth DOM classes
		this.config = {
			authClass: 'Auth',
			backgroundClass: 'Auth-background',
			innerClass: 'Auth-inner',
			userClass: 'AuthUser',
			actionClass: 'AuthAction',
			btnLoginClass: 'Button Button--login',
			btnLogoutClass: 'Button Button--logout'
		};

		// Auth DOM elements
		this.viewport = parent; // its parent element
		this.auth = {}; // the auth element
		this.background = {};
		this.inner = {};
		this.userView = {}; // user block (store info and actions about user)
		this.action = {}; // contains user action buttons
		this.buttonLogin = {}; // button element (login button)
		this.buttonLogout = {}; // button element (logout button)

		this.login = function () {

			if (!firebase.auth().currentUser) {

				var provider = new firebase.auth.FacebookAuthProvider();
				firebase.auth().signInWithRedirect(provider);

			}

		};

		this.logout = function () {
			if (firebase.auth().currentUser) {
				console.log('called logout func');

				// set up interface to signed out user
				firebase.auth().signOut();
				self.setLoggedOutDisplay();
			}

		};

		this.onUserChange = function () {
			console.log('called OnUserChange');

			firebase.auth().onAuthStateChanged(function(authUser) {

				if (authUser) {
					console.log('authUser true @ onAuthStateChangeDisplay');
					self.user.setUserData(authUser);
					self.user.setSignInStatus(true);
					self.user.save();
					self.setLoggedInDisplay();
					self.onSignInStateChange();

				} else {
					console.log('authUser false @ onAuthStateChange');

					self.user.setSignInStatus(false);

					// for firebase, user is off, but for localstorage, he is on
					// if (localStorage.getItem('auth') && localStorage.getItem('online')) {
					// 	self.setLoggedInInfo();
					// }
				}
			});

		};

	}

	Auth.prototype.init = function () {

		var self = this;

		
		this.normalize();
		this.user = new User(this.userView.viewport);

		this.buttonLogin.addEventListener('click', function () {

			self.user.authMessageStatusOut.viewport.innerText = "Fazendo login...";
			setTimeout(self.login, 1000);

		});

		this.buttonLogout.addEventListener('click', function () {

			self.logout();

		});

	};

	Auth.prototype.normalize = function () {

		// create auth element
		this.auth.viewport = document.createElement('div');
		this.auth.viewport.className = this.config.authClass;

		// append auth element to its viewport ( parent element = Balsapp-inner )
		this.viewport.appendChild(this.auth.viewport);

		// create auth background element
		this.background.viewport = document.createElement('div');
		this.background.viewport.className = this.config.backgroundClass;

		// create auth inner element
		this.inner.viewport = document.createElement('div');
		this.inner.viewport.className = this.config.innerClass;

		// append both background and inner to auth element
		this.auth.viewport.appendChild(this.background.viewport);
		this.auth.viewport.appendChild(this.inner.viewport);

		// create auth user (as userView to mantain user (User object)) element
		this.userView.viewport = document.createElement('div');
		this.userView.viewport.className = this.config.userClass;

		// create auth action element
		this.action.viewport = document.createElement('div');
		this.action.viewport.className = this.config.actionClass;

		// append both userview and action element to inner element
		this.inner.viewport.appendChild(this.userView.viewport);
		this.inner.viewport.appendChild(this.action.viewport);

		// create button login
		this.buttonLogin = document.createElement('button');
		this.buttonLogin.className = this.config.btnLoginClass;
		this.buttonLogin.innerHTML = '<span>Entrar</span>';

		// create button logout
		this.buttonLogout = document.createElement('button');
		this.buttonLogout.className = this.config.btnLogoutClass;
		this.buttonLogout.innerHTML = '<span>Sair</span>';

		// append both login and logout button to action element
		this.action.viewport.appendChild(this.buttonLogin);
		this.action.viewport.appendChild(this.buttonLogout);

	};

	Auth.prototype.getUser = function () {

		return this.user;

	};

	Auth.prototype.getDisplayFields = function () {

		var name = this.user.infoDisplayName;
		var photo = this.user.photo;
		
		return {0: name, 1: photo};

	};

	Auth.prototype.setLoggedInDisplay = function () {

		var info = this.getDisplayFields();
		var userData = this.user.getUserData();

		info[0].viewport.innerText = userData.displayName;
		var img = document.createElement('img');
		img.alt = userData.displayName;
		img.src = userData.photoURL;
		info[1].viewport.appendChild(img);

	};

	Auth.prototype.setLoggedOutDisplay = function () {

		var fields = this.getDisplayFields();
		fields[0].innerHTML = "";
		fields[1].viewport.innerHTML = "";

		var balsaStatus = document.getElementById('balsapp').classList;
		balsaStatus.remove('is-signed-in');
		balsaStatus.add('is-signed-out');

	};

	return Auth;

})();