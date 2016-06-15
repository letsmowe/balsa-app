
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

	return Queue;

})();