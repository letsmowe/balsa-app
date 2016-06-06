
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