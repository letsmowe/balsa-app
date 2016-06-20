
/* Queue */

var Queue = (function () {

	/**
	 * Queue constructor
	 * @constructor
	 */
	function Queue() {

		this.count = 0;

		this.user = 0;
		this.isValid = true;
		this.direction = {};
		this.timestamp = 0;

	}

	/**
	 * Queue firebase save function
	 * @param queueRef firebase ref
	 */
	Queue.prototype.save = function (queueRef) {

		if (queueRef && this.direction) {

			queueRef.push({
				count: this.count,
				direction: this.direction,
				isValid: this.isValid,
				timestamp: this.timestamp,
				user: this.user
			});

		}

	};

	/**
	 * Set data queue object
	 * @param {int} count number of vehicles on the queue
	 * @param {object} direction object with key equals 'from' and value equals 'to' (BAND:ITCA or ITCA:BAND)
	 * @param {string} user who inserted count value
	 */
	Queue.prototype.setQueue = function (count, direction, user) {

		this.count = count;
		this.direction = direction;
		this.timestamp = Date.now(); //timestamp = new Date().toString()
		this.user = user;

	};

	return Queue;

})();