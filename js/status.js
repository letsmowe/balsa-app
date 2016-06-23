
/* Status management class */

var Status = (function () {

	/**
	 * Status constructor
	 * @constructor
	 */
	function Status() {

		this.title = '';
		this.user = '';
		this.message = '';
		this.className = ''; //type of status?
		this.timestamp = '';

	}

	Status.prototype.save = function (statusRef) {

		if (statusRef) {
			statusRef.push({
				title: this.title,
				user: this.user,
				message: this.message,
				timestamp: this.timestamp
			});
		}

	};

	Status.prototype.setStatus = function (title, message, user, timestamp, classname) {

		this.title = title;
		this.message = message;
		this.user = user;
		this.timestamp = timestamp;
		this.className = classname;

	};

	Status.prototype.getStatus = function () {

		return this;

	};

	return Status;

})();