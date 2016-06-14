
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