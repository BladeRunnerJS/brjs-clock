'use strict';

var Clock = require('../src/Clock.js');
var expect = require('expectations');

describe('Clock', function() {
	var clock;
	var timeoutCounter, intervalCounter;

	beforeEach(function() {
		clock = new Clock();
		clock.install();

		timeoutCounter = 0;
		intervalCounter = 0;

		setTimeout(function() {
			timeoutCounter++;
		}, 1000);

		setInterval(function() {
			intervalCounter++;
		}, 2000);
	});

	afterEach(function() {
		clock.uninstall();
	});

	it('does not fire timers by default', function() {
		expect(timeoutCounter).toBe(0);
	});

	it('does not fire intervals by default', function() {
		expect(intervalCounter).toBe(0);
	});

	it('fires the timers if enough time elapses', function() {
		clock.tick(1000);
		expect(timeoutCounter).toBe(1);
	});

	it('only fires the timer once', function() {
		clock.tick(1000);
		expect(timeoutCounter).toBe(1);
		clock.tick(1000);
		expect(timeoutCounter).toBe(1);
	});

	it('does not fire if not enough time has elapsed', function() {
		clock.tick(999);
		expect(timeoutCounter).toBe(0);
	});

	it('accumulates correctly', function() {
		clock.tick(999);
		expect(timeoutCounter).toBe(0);
		clock.tick(1);
		expect(timeoutCounter).toBe(1);
	});

	it('fires at each interval', function() {
		clock.tick(2000);
		expect(intervalCounter).toBe(1);
		clock.tick(2000);
		expect(intervalCounter).toBe(2);
	});

	it('does not fire if not enough time has elapsed', function() {
		clock.tick(1999);
		expect(intervalCounter).toBe(0);
	});

	it('resets the timers correctly', function() {
		clock.reset();
		clock.tick(2000);
		expect(timeoutCounter).toBe(0);
		expect(intervalCounter).toBe(0);
	});
});
