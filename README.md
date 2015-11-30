## brjs-clock

[![Build Status](https://travis-ci.org/BladeRunnerJS/brjs-clock.svg)](https://travis-ci.org/BladeRunnerJS/brjs-clock)

brjs-clock is a library that provides a Clock class that allows the test writer to control the flow of time during tests.

## Installation

To install brjs-clock use:

`npm install brjs-clock`

## Code Example

```javascript
'use strict';

var clock = require('brjs-clock');
var expect = require('expectations');

describe('Clock', function() {
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

	it('fires the timer only once', function() {
		clock.tick(999);
		expect(timeoutCounter).toBe(0);
		clock.tick(1);
		expect(timeoutCounter).toBe(1);
		clock.tick(1000);
		expect(timeoutCounter).toBe(1);
	});

	it('fires at each interval', function() {
		clock.tick(2000);
		expect(intervalCounter).toBe(1);
		clock.tick(2000);
		expect(intervalCounter).toBe(2);
	});
});
```