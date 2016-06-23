
/* Current */

var Current = (function () {

	/**
	 * Current constructor
	 * @param {Element} parent element parent viewport (current parent element = Balsapp-stage)
	 * @constructor
	 */
	function Current(parent) {

		var self = this;

		// Current properties
		this.status = new Status();

		// Current DOM classes
		this.config = {
			currentClass: 'Current',
			statusClass: 'CurrentStatus',
			displayClass: 'CurrentStatus Status-display',
			editClass: 'CurrentStatus Status-edit',
			submitClass: 'CurrentStatus Status-submit',
			counterBANDClass: 'Current-counter CounterBand Counter-edit',
			counterITCAClass: 'Current-counter CounterItca Counter-edit',
			counterSubmitClass: 'CurrentStatus Status-submit'

		};
		
		// Current DOM elements
		this.viewport = parent; // Current parent element = Balsapp-stage
		this.current = {};
		this.statusView = {};
		this.statusDisplay = {}; // not being used
		this.statusEdit = {};
		this.statusSubmit = {};
		this.counterBandDisplay = {};
		this.counterBandEdit = {};
		this.counterBandSubmit = {};
		this.counterItcaDisplay = {};
		this.counterItcaEdit = {};
		this.counterItcaSubmit = {};

		this.onStatusChange = function (snap) {

			snap.forEach(function(childSnap) {
				console.log(childSnap.val().title);
				self.statusEdit.viewport.value = childSnap.val().title;

				return true;
			});

		};

		this.onCounterChange = function (snap) {

			var bandc = 0;
			var itcac = 0;

			// now its walking through all result array, but later will only get ref('/current/')
			snap.forEach(function(childSnap) {
				if (childSnap.val().direction == 'BAND' && childSnap.val().isValid) {
					bandc = childSnap.val().count;
				} else if (childSnap.val().direction == 'ITCA' && childSnap.val().isValid) {
					itcac = childSnap.val().count;
				}
			});

			self.counterBandEdit.viewport.value = bandc;
			console.log('dir: band # ' + bandc);

			self.counterItcaEdit.viewport.value = itcac;
			console.log('dir: itca # ' + itcac);

		};

		this.onStatusSubmitClick = function () {

			var newStatus = {
				title: self.statusEdit.viewport.value,
				message: self.statusEdit.viewport.value,
				user: firebase.auth().currentUser.uid,
				className: 'Normal',
				timestamp: Date.now()
			};

			firebase.database().ref('/status/').push(newStatus);
		};

		this.onCounterBandSubmitClick = function () {

			var newQueue = {
				count: self.counterBandEdit.viewport.value,
				direction: 'BAND',
				user: firebase.auth().currentUser.uid,
				isValid: true,
				timestamp: Date.now()
			};

			firebase.database().ref('/queue/').push(newQueue);

		};

		this.onCounterItcaSubmitClick = function () {

			var newQueue = {
				count: self.counterItcaEdit.viewport.value,
				direction: 'ITCA',
				user: firebase.auth().currentUser.uid,
				isValid: true,
				timestamp: Date.now()
			};

			firebase.database().ref('/queue/').push(newQueue);
		};
		
		if (this.viewport)
			this.init();

	}

	Current.prototype.addListeners = function () {

		this.statusSubmit.addEventListener('click', this.onStatusSubmitClick, false);
		this.counterBandSubmit.addEventListener('click', this.onCounterBandSubmitClick, false);
		this.counterItcaSubmit.addEventListener('click', this.onCounterItcaSubmitClick, false);

	};

	/**
	 * Normalize Current DOM elements
	 *  create current elements blocks and placeholders
	 */
	Current.prototype.normalize = function () {

		// create current element
		this.current.viewport = document.createElement('div');
		this.current.viewport.className = this.config.currentClass;

		// append current element block to its parent (parent = Balsapp-stage)
		this.viewport.appendChild(this.current.viewport);

		// create status block element
		this.statusView.viewport = document.createElement('div');
		this.statusView.viewport.className = this.config.statusClass;

		// append status element block to Current element
		this.current.viewport.appendChild(this.statusView.viewport);

		// create status manipulation blocks and elements
		this.statusDisplay.viewport = document.createElement('div');
		this.statusDisplay.viewport.innerHTML = 'Status atual';
		this.statusDisplay.viewport.className = this.config.displayClass;
		this.statusEdit.viewport = document.createElement('input');
		this.statusEdit.viewport.className = this.config.editClass;
		this.statusSubmit = document.createElement('button');
		this.statusSubmit.innerText = 'Atualizar';
		this.statusSubmit.className = this.config.submitClass;

		this.statusView.viewport.appendChild(this.statusDisplay.viewport);
		this.statusDisplay.viewport.appendChild(this.statusEdit.viewport);
		this.statusDisplay.viewport.appendChild(this.statusSubmit);

		this.counterBandDisplay.viewport = document.createElement('div');
		this.counterBandDisplay.viewport.innerHTML = 'Fila ITCA > BAND';
		this.counterBandDisplay.viewport.className = this.config.displayClass;
		this.counterBandEdit.viewport = document.createElement('input');
		this.counterBandEdit.viewport.className = this.config.counterBANDClass;
		this.counterBandSubmit = document.createElement('button');
		this.counterBandSubmit.innerText = 'Atualizar';
		this.counterBandSubmit.className = this.config.counterSubmitClass;

		this.counterItcaDisplay.viewport = document.createElement('div');
		this.counterItcaDisplay.viewport.innerHTML = 'Fila BAND > ITCA';
		this.counterItcaDisplay.viewport.className = this.config.displayClass;
		this.counterItcaEdit.viewport = document.createElement('input');
		this.counterItcaEdit.viewport.className = this.config.counterITCAClass;
		this.counterItcaSubmit = document.createElement('button');
		this.counterItcaSubmit.innerText = 'Atualizar';
		this.counterItcaSubmit.className = this.config.counterSubmitClass;


		this.statusView.viewport.appendChild(this.counterBandDisplay.viewport);
		this.counterBandDisplay.viewport.appendChild(this.counterBandEdit.viewport);
		this.counterBandDisplay.viewport.appendChild(this.counterBandSubmit);

		this.statusView.viewport.appendChild(this.counterItcaDisplay.viewport);
		this.counterItcaDisplay.viewport.appendChild(this.counterItcaEdit.viewport);
		this.counterItcaDisplay.viewport.appendChild(this.counterItcaSubmit);


		this.addListeners();

	};

	/**
	 *
	 */
	Current.prototype.displayCurrent = function () {

		var currentData = this.getCurrent();

		this.statusDisplay.viewport = currentData.status.title;
		// counters skipped

	};

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
	Current.prototype.setCurrent = function () {
		
		// this.status = this.retrieveStatus();
		// this.band = this.retrieveDirection(queueRef, 'BAND > ITCA');
		// this.itca = this.retrieveDirection(queueRef, 'ITCA > BAND');

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
	
	Current.prototype.retrieveStatus = function () {

		var self = this;

		firebase.database().ref('/status/').limitToLast(1).once('value').then(function (snapshot) {

			var last = snapshot.key;

			if (last) {

				console.log(snapshot[last]);
				console.log(snapshot);

			} else {
				self.status = {};
			}

		});

		return status;
		
	};

	/**
	 * Initialize the Current class
	 */
	Current.prototype.init = function () {

		this.normalize();

		firebase.database().ref('/status/').limitToLast(1).on('value', this.onStatusChange);
		firebase.database().ref('/queue/').orderByKey().on('value', this.onCounterChange);

		this.setCurrent();

		this.displayCurrent();

	};

	return Current;

})();