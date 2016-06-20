
/* Current */

var Current = (function () {

	/**
	 * Current constructor
	 * @param {Element} parent element parent viewport (current parent element = Balsapp-stage)
	 * @constructor
	 */
	function Current(parent) {

		this.viewport = parent;
		
		this.status = {};
		this.band = {};
		this.itca = {};

	}

	/**
	 * Get current counters and app status
	 * @returns {Current}
	 */
	Current.prototype.getCurrent = function () {

		return this;

	};

	/**
	 * Set current counter and app status on Current class
	 * @param {Object} statusRef
	 * @param {Object} queueRef
	 */
	Current.prototype.setCurrent = function (statusRef, queueRef) {
		
		this.status = this.retrieveStatus(statusRef);
		this.band = this.retrieveDirection(queueRef, 'BAND > ITCA');
		this.itca = this.retrieveDirection(queueRef, 'ITCA > BAND');

	};

	/**
	 * Pull data from firebase and create queue object for 'BAND > ITCA' or 'ITCA > BAND'
	 * @param queueRef firebase queue reference
	 * @param {object} direc direction array
	 * @returns {Queue}
	 */
	Current.prototype.retrieveDirection = function (queueRef, direc) {

		var queue = new Queue();
		var queryRef = queueRef.child(direc).orderByKey().limitToLast(1);

		queryRef.once('value').then(function(snapshot) {
			
			var result = snapshot.val();
			
			if (result.isValid)
				queue.setQueue(result.count, result.direction, result.timestamp, result.user);
			else 
				queue = {};
			
		});

		return queue;

	};
	
	Current.prototype.retrieveStatus = function (statusRef) {
		
		var status = new Status();
		var queryRef = statusRef.orderByKey().limitToLast(1);

		queryRef.once('value').then(function (snapshot) {

			var result = snapshot.val();

			if (result)
				status.setStatus(result.title, result.message, result.user);
			else
				status = {};

		});

		return status;
		
	};

	return Current;

})();