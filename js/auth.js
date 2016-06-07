
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