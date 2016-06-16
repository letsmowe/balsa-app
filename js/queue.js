
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

	Queue.prototype.save = function (queueRef) {

		if (queueRef) {
			queueRef.update({
				count: this.count,
				direction: this.direction,
				timestamp: this.timestamp,
				user: this.user
			});
		}

	};

	Queue.prototype.setQueue = function (count, direction, user) {

		this.count = count;
		this.direction = direction;
		this.timestamp = new Date().toString();
		this.user = user;

	};

	Queue.prototype.getQueue = function () {

		return this;

	};

	return Queue;

})();