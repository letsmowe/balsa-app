
/* User management class */

var User = (function () {

	/**
	 * User management class constructor  constructor
	 * @constructor
	 */
	function User(authUser) {

		this.uid = authUser.uid;
		this.displayName = authUser.displayName;
		this.photoURL = authUser.photoURL;
		this.providerData = this.setProviderData(authUser.providerData);

	}
	
	User.prototype.setProviderData = function (providerData) {
		
		if (providerData.length)
			return providerData[0];
		
	
	};
	
	User.prototype.save = function () {
	
		var usersRef = database.ref('users');
		usersRef.child(this.uid).set(this);
	
	};

	User.prototype.getUserInfo = function () {
	
		return this;
		
	};

	return User;

})();