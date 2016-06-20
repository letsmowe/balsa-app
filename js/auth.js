
/* Balsa App Auth */

var Auth = (function () {

	/**
	 * Balsa App Auth constructor
	 * @constructor
	 * @param {Element} parent parent element viewport (auth parent element = Balsapp-inner)
	 */
	function Auth(parent) {

		var self = this;

		this.config = {
			authClass: 'Auth',
			backgroundClass: 'Auth-background',
			innerClass: 'Auth-inner',
			userClass: 'AuthUser',
			actionClass: 'AuthAction',
			messageInClass: 'AuthMessage AuthMessage--signed-in',
			messageOutClass: 'AuthMessage AuthMessage--signed-in'
		};

		this.viewport = parent; // its parent element
		this.auth = {};
		this.background = {};
		this.inner = {};
		this.userView = {};
		this.action = {};
		this.buttonLogin = {};
		this.buttonLogout = {};

		if (this.viewport) {

			this.init();

		}

		// implying firebase config is already set up
		this.login = function () {

			if (!firebase.auth().currentUser) {

				var provider = new firebase.auth.FacebookAuthProvider();
				firebase.auth().signInWithRedirect(provider);

				firebase.auth().getRedirectResult().then(function (result) {

					if (firebase.auth().currentUser == null) {
						// go to facebook authentication page and set online true
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
			self.removeLocalStorage();
			self.setLoggedOutInfo();

		};

		this.onUserChange = function () {
			console.log('called OnUserChange');

			firebase.auth().onAuthStateChanged(function(authUser) {

				if (authUser) {
					console.log('authUser true @ onAuthStateChange');

					self.user.setUserData(authUser);
					self.user.setSignInStatus(true);
					self.setLocalStorage();
					self.user.save();

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

			// if (localStorage.getItem('online')) {
			// 	self.displayInfo();
			// }

		};

	}

	Auth.prototype.init = function () {

		this.normalize();
		this.user = new User(this.userView.viewport);

	};

	Auth.prototype.normalize = function () {

		// create auth element
		this.auth.viewport = document.createElement('div');
		this.auth.viewport.className = this.config.authClass;

		this.viewport.appendChild(this.auth.viewport);

		// create auth background element
		this.background.viewport = document.createElement('div');
		this.background.viewport.className = this.config.backgroundClass;

		// create auth inner element
		this.inner.viewport = document.createElement('div');
		this.inner.viewport.className = this.config.innerClass;

		this.auth.viewport.appendChild(this.background.viewport);
		this.auth.viewport.appendChild(this.inner.viewport);

		// create auth user (as userView to mantain user (User object)) element
		this.userView.viewport = document.createElement('div');
		this.userView.viewport.className = this.config.userClass;

		// create auth action element
		this.action.viewport = document.createElement('div');
		this.action.viewport.className = this.config.actionClass;

		this.inner.viewport.appendChild(this.userView.viewport);
		this.inner.viewport.appendChild(this.action.viewport);

		this.buttonLogin = document.createElement('button');
		this.buttonLogin.className = 'Button Button--login';
		this.buttonLogin.innerHTML = '<span>Entrar</span>';

		this.buttonLogout = document.createElement('button');
		this.buttonLogout.className = 'Button Button--logout';
		this.buttonLogout.innerHTML = '<span>Sair</span>';

		this.action.viewport.appendChild(this.buttonLogin);
		this.action.viewport.appendChild(this.buttonLogout);

	};

	// WARNING: wont work, user is created using setUserData and retrive data using getUserData
	Auth.prototype.getUser = function () {

		return this.user;

	};

	Auth.prototype.displayInfo = function () {

		var balsaStatus = document.getElementById('balsapp').classList;

		if (balsaStatus.contains('is-signed-out')) {

			balsaStatus.remove('is-signed-out');
			balsaStatus.add('is-signed-in');

		}

	};

	Auth.prototype.setLocalStorage = function () {

		var str = JSON.stringify(this);
		localStorage.setItem('auth', str);

	};

	Auth.prototype.removeLocalStorage = function () {

		localStorage.removeItem('auth');
		localStorage.removeItem('online');

	};

	Auth.prototype.getLocalStorage = function () {

		var storedData = localStorage.getItem('auth');
		storedData = JSON.parse(storedData);

		return storedData;

	};

	Auth.prototype.getInfoFields = function () {

		var name = document.getElementsByClassName('User-display-name')[0];
		var photo = document.getElementsByClassName('UserPhoto')[0];
		
		return {0: name, 1: photo};

	};

	Auth.prototype.setLoggedInInfo = function () {

		var info = this.getInfoFields();
		var storedData;

		if (localStorage.length) {

			storedData = this.getLocalStorage();

			info[0].textContent = storedData.user.displayName;
			var img = document.createElement('img');
			img.alt = storedData.user.displayName;
			img.src = storedData.user.photoURL;
			info[1].innerHTML = "";
			info[1].appendChild(img);

		}

	};

	Auth.prototype.setLoggedOutInfo = function () {

		var fields = this.getInfoFields();
		fields[0].innerHTML = "";
		fields[1].innerHTML = "";

		var balsaStatus = document.getElementById('balsapp').classList;
		balsaStatus.remove('is-signed-in');
		balsaStatus.add('is-signed-out');

	};

	return Auth;

})();