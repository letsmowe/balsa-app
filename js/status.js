
/* Status management class */

var Status = (function () {

	/**
	 * Status constructor
	 * @param {Reference} ref reference for status firebase node
	 * @constructor
	 */
	function Status(ref) {

		this.title = '';
		this.user = '';
		this.message = '';
		this.className = ''; //type of status?
		this.timestamp = '';
		this.ref = ref;

	}

	/**
	 * Save status data on firebase status reference
	 *  if successfull, return true, otherwise, return false
	 * @returns {boolean}
	 */
	Status.prototype.save = function () {

		if (this.ref) {
			if(this.ref.push({
				title: this.title,
				message: this.message,
				user: this.user,
				className: this.className,
				timestamp: this.timestamp
			}))
				return true;
		}
		
		return false;

	};

	/**
	 * Set info about status
	 * @param {String} title same as the value on the edit field
	 * @param {String} message same as title
	 * @param {String} user user id
	 * @param {String} className type of class (warning, normal, error)
	 */
	Status.prototype.setStatus = function (title, message, user, className) {

		this.title = title;
		this.message = message;
		this.user = user;
		this.className = className;
		this.timestamp = 0 - Date.now();

	};

	/**
	 * Return info about status
	 * @returns {{title: *, message: *, user: *, className: *, timestamp: *}}
	 */
	Status.prototype.getStatus = function () {

		return {
			'title': this.title,
			'message': this.message,
			'user': this.user,
			'className': this.className,
			'timestamp': this.timestamp
		};

	};

	return Status;

})();