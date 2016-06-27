
/* Current */

var Current = (function () {

	/**
	 * Current constructor
	 * @param {Element} parent element parent viewport (current parent element = Balsapp-stage)
	 * @param {Object} refs receive all firebase nodes references
	 * @constructor
	 */
	function Current(parent, refs) {

		var self = this;
		this.refs = refs; // get all firebase references

		// Current properties
		this.status = new Status(this.refs.statusRef);
		this.queue = new Queue(this.refs.queueRef);

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

		/**
		 * Update display fields with data from current firebase node
		 *  this is a function for a listener created on current reference (see this.init)
		 *  define this.status/band/itca with the most recent data (status title, band count, and itca count, respectively)
		 *  display current data on fields
		 * @param {Object} snap returned data from current firebase reference
		 */
		this.onCurrentChange = function (snap) {

			console.log('status > ' + snap.val().status.title);
			console.log('band > ' + snap.val().band.count);
			console.log('itca > ' + snap.val().itca.count);
			self.statusTitle = snap.val().status.title;
			self.bandCount = snap.val().band.count;
			self.itcaCount = snap.val().itca.count;

			self.statusEdit.viewport.value = snap.val().status.title;
			self.counterBandEdit.viewport.value = snap.val().band.count;
			self.counterItcaEdit.viewport.value = snap.val().itca.count;

		};

		/**
		 * Triggered function for submit/update status
		 *  create an status object with recent values (from fields),
		 *  check if status title is not equals to the current title (defined on onCurrentChange)
		 *      if it is not equals to current title, push newStatus to status node and update current node
		 */
		this.onStatusSubmitClick = function () {

			var statusTitle = self.statusEdit.viewport.value;
			self.status.setStatus(statusTitle, statusTitle, self.refs.auth.currentUser.uid, 'normal');

			if (self.statusTitle != statusTitle) {

				if (self.status.save()) {
					self.refs.currentRef.update({'status': self.status.getStatus()});
				} else {
					console.log('Não foi possível atualizar o status');
				}

			} else {
				console.log('O status é idêntico ao atual');
			}

		};

		/**
		 * Triggered function for submit/update band counter
		 *  create a queue object with recent values (from fields),
		 *  check if band count is not equals to the current band count (defined on onCurrentChange)
		 *      if it is not equals to current count, push newQueue to queue reference, but will only update current
		 *      node if it is a valid counter entry (isValid must equals true)
		 *      it it is not valid (isValid equals false) show message and call OnCurrentChange once (to update modified
		 *      fields values.
		 */
		this.onCounterBandSubmitClick = function () {

			var bandCount = self.counterBandEdit.viewport.value;
			self.queue.setQueue(bandCount, 'BAND', self.refs.auth.currentUser.uid);

			if(self.bandCount != bandCount) {

				// this comparation push newQueue even if isValid equals false, but only
				// updates current if isValid equals true and newQueue is pushed into queue
				if (self.queue.getQueue().isValid && self.queue.save()) {
					self.refs.currentRef.update({'band': self.queue.getQueue()});
				} else {
					console.log('Entrada inválida, o valor não será atualizado');
					self.refs.currentRef.once('value').then(self.onCurrentChange);
				}

			} else {
				console.log('Número do contador para BAND é idêntico ao atual');
			}

		};

		/**
		 * Triggered function for submit/update itca counter
		 *  create a queue object with recent values (from fields),
		 *  check if itca count is not equals to the current itca count (defined on onCurrentChange)
		 *      if it is not equals to current count, push newQueue to queue reference, but will only update current
		 *      node if it is a valid counter entry (isValid must equals true)
		 *      it it is not valid (isValid equals false) show message and call OnCurrentChange once (to update modified
		 *      fields values.
		 */
		this.onCounterItcaSubmitClick = function () {

			var itcaCount = self.counterItcaEdit.viewport.value;
			self.queue.setQueue(itcaCount, 'ITCA', self.refs.auth.currentUser.uid);

			if(self.itcaCount != itcaCount) {

				if (self.queue.getQueue().isValid && self.queue.save()) {
					self.refs.currentRef.update({'itca': self.queue.getQueue()});
				} else {
					console.log('Entrada inválida, o valor não será atualizado');
					self.refs.currentRef.once('value').then(self.onCurrentChange);
				}

			} else {
				console.log('Número do contador para ITCA é idêntico ao atual');
			}
		};
		
		if (this.viewport) {

			this.init();

		}

	}

	/**
	 * Create all listeners for submit buttons
	 */
	Current.prototype.addListeners = function () {

		this.statusSubmit.addEventListener('click', this.onStatusSubmitClick, false);
		this.counterBandSubmit.addEventListener('click', this.onCounterBandSubmitClick, false);
		this.counterItcaSubmit.addEventListener('click', this.onCounterItcaSubmitClick, false);

	};

	/**
	 * Normalize Current DOM elements
	 *  create current elements blocks and placeholders, and call addListeners to set listener on created blocks
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

		// append status view and display inside blocks
		this.statusView.viewport.appendChild(this.statusDisplay.viewport);
		this.statusDisplay.viewport.appendChild(this.statusEdit.viewport);
		this.statusDisplay.viewport.appendChild(this.statusSubmit);

		// create element blocks for destination BAND counter/queue
		this.counterBandDisplay.viewport = document.createElement('div');
		this.counterBandDisplay.viewport.innerHTML = 'Fila ITCA > BAND';
		this.counterBandDisplay.viewport.className = this.config.displayClass;
		this.counterBandEdit.viewport = document.createElement('input');
		this.counterBandEdit.viewport.className = this.config.counterBANDClass;
		this.counterBandSubmit = document.createElement('button');
		this.counterBandSubmit.innerText = 'Atualizar';
		this.counterBandSubmit.className = this.config.counterSubmitClass;

		// create element blocks for destination ITCA counter/queue
		this.counterItcaDisplay.viewport = document.createElement('div');
		this.counterItcaDisplay.viewport.innerHTML = 'Fila BAND > ITCA';
		this.counterItcaDisplay.viewport.className = this.config.displayClass;
		this.counterItcaEdit.viewport = document.createElement('input');
		this.counterItcaEdit.viewport.className = this.config.counterITCAClass;
		this.counterItcaSubmit = document.createElement('button');
		this.counterItcaSubmit.innerText = 'Atualizar';
		this.counterItcaSubmit.className = this.config.counterSubmitClass;

		// append dest. BAND to its display block
		this.statusView.viewport.appendChild(this.counterBandDisplay.viewport);
		this.counterBandDisplay.viewport.appendChild(this.counterBandEdit.viewport);
		this.counterBandDisplay.viewport.appendChild(this.counterBandSubmit);

		// append dest. ITCA to its display block
		this.statusView.viewport.appendChild(this.counterItcaDisplay.viewport);
		this.counterItcaDisplay.viewport.appendChild(this.counterItcaEdit.viewport);
		this.counterItcaDisplay.viewport.appendChild(this.counterItcaSubmit);

		this.addListeners();

	};

	/**
	 * Initialize the Current class
	 */
	Current.prototype.init = function () {

		this.normalize();
		this.refs.currentRef.on('value', this.onCurrentChange);

		/*
		// Testing order for most recent first
		// May not be useful now, but later will help on update current values when queue set isValid equals false
		// isValid turns false when an user is set into douchebag
		var bandv = false;
		var itcav = false;
		firebase.database().ref('/queue/').orderByChild('timestamp').on('child_added', function(snap) {

			if (snap.val().direction == 'BAND' && snap.val().isValid && !bandv) {

				bandv = true;
				self.counterBandEdit.viewport.value = snap.val().count;
				firebase.database().ref('/current/').update({'band': snap.val()});

			} else if ((snap.val().direction == 'ITCA' && snap.val().isValid) && !itcav) {

				itcav = true;
				self.counterItcaEdit.viewport.value = snap.val().count;
				firebase.database().ref('/current/').update({'itca': snap.val()});

			}

		});

		// testing descending order result query
		for (var i = 1; i <= 5; i++)
		 firebase.database().ref('/test/').push({'timestamp': 0 - Date.now(), 'val': i});

		firebase.database().ref('/test/').orderByChild('timestamp').on('child_added', function(snap){
		 console.log('decresc' + snap.val().val);
		});

		*/

	};

	return Current;

})();