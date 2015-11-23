'use strict';

function Clock() {
	this.timeoutsMade = 0;
	this.scheduledFunctions = {};
	this.nowMillis = 0;
}

Clock.prototype.install = function() {
	this.installed = true;
	this.origSetTimeout = setTimeout;
	this.origSetInterval = setInterval;
	this.origClearTimeout = clearTimeout;
	this.origClearInteval = clearInterval;

	global.setTimeout = function(funcToCall, millis) {
		this.timeoutsMade = this.timeoutsMade + 1;
		this._scheduleFunction(this.timeoutsMade, funcToCall, millis, false);
		return this.timeoutsMade;
	}.bind(this);

	global.setInterval = function(funcToCall, millis) {
		this.timeoutsMade = this.timeoutsMade + 1;
		this._scheduleFunction(this.timeoutsMade, funcToCall, millis, true);
		return this.timeoutsMade;
	}.bind(this);

	global.clearTimeout = function(timeoutKey) {
		this.scheduledFunctions[timeoutKey] = undefined;
	}.bind(this);

	global.clearInterval = function(timeoutKey) {
		this.scheduledFunctions[timeoutKey] = undefined;
	}.bind(this);
};

Clock.prototype.uninstall = function() {
	this.installed = false;
	global.setTimeout = this.origSetTimeout;
	global.setInterval = this.origSetInterval;
	global.clearTimeout = this.origClearTimeout;
	global.clearInterval = this.origClearInteval;
};

Clock.prototype.reset = function() {
	this._verifyInstalled();

	this.scheduledFunctions = {};
	this.nowMillis = 0;
	this.timeoutsMade = 0;
};


Clock.prototype.tick = function(millis) {
	this._verifyInstalled();

	var oldMillis = this.nowMillis;
	var newMillis = oldMillis + millis;
	this._runFunctionsWithinRange(oldMillis, newMillis);
	this.nowMillis = newMillis;
};

Clock.prototype._runFunctionsWithinRange = function(oldMillis, nowMillis) {
	this._verifyInstalled();

	var scheduledFunc;
	var funcsToRun = [];
	for (var timeoutKey in this.scheduledFunctions) {
		scheduledFunc = this.scheduledFunctions[timeoutKey];
		if (scheduledFunc !== undefined &&
			scheduledFunc.runAtMillis >= oldMillis &&
			scheduledFunc.runAtMillis <= nowMillis) {
			funcsToRun.push(scheduledFunc);
			this.scheduledFunctions[timeoutKey] = undefined;
		}
	}

	if (funcsToRun.length > 0) {
		funcsToRun.sort(function(a, b) {
			return a.runAtMillis - b.runAtMillis;
		});

		for (var i = 0; i < funcsToRun.length; ++i) {
			try {
				this.nowMillis = funcsToRun[i].runAtMillis;
				funcsToRun[i].funcToCall();
				if (funcsToRun[i].recurring) {
					this._scheduleFunction(
						funcsToRun[i].timeoutKey,
						funcsToRun[i].funcToCall,
						funcsToRun[i].millis,
						true);
				}
			} catch(e) {
				console.log(e);
			}
		}
		this._runFunctionsWithinRange(oldMillis, nowMillis);
	}
};

Clock.prototype._scheduleFunction = function(timeoutKey, funcToCall, millis, recurring) {
	this._verifyInstalled();

	this.scheduledFunctions[timeoutKey] = {
			runAtMillis: this.nowMillis + millis,
			funcToCall: funcToCall,
			recurring: recurring,
			timeoutKey: timeoutKey,
			millis: millis
	};
};

Clock.prototype._verifyInstalled = function() {
	if(!this.installed) {
		throw new Error('Clock cannot be used until you\'ve installed it. You should install it in your set-up method, and uninstall it in your tear-down method.');
	}
};

module.exports = Clock;
