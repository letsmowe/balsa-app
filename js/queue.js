
/* Queue */

var Queue = (function () {

	/**
	 * Queue constructor
	 * @param {Reference} ref queue firebase reference
	 * @constructor
	 */
	function Queue(ref) {

		this.count = 0;
		this.user = '';
		this.direction = '';
		this.isValid = true;
		this.timestamp = 0;
		this.ref = ref;

	}

	/**
	 * Queue firebase save function
	 */
	Queue.prototype.save = function () {

		if (this.ref) {

			if(this.ref.push({
				count: this.count,
				direction: this.direction,
				isValid: this.isValid,
				timestamp: this.timestamp,
				user: this.user
			}))
				return true;

		}

		return false;

	};

	/**
	 * Set data queue object
	 * @param {int} count number of vehicles on the queue
	 * @param {string} direction means 'final destination', while it's just band > itca and itca > band
	 * @param {string} user id that updated count value
	 */
	Queue.prototype.setQueue = function (count, direction, user) {

		this.count = count;
		this.direction = direction;
		this.user = user;
		this.timestamp = 0 - Date.now();
		//isValid always equals true

	};

	/**
	 * Return queue info
	 * @returns {{count: *, user: *, direction: *, isValid: *, timestamp: *}}
	 */
	Queue.prototype.getQueue = function () {

		return {
			'count': this.count,
			'user': this.user,
			'direction': this.direction,
			'isValid': this.isValid,
			'timestamp': this.timestamp
		};

	};

	return Queue;

})();