'use strict';

var clock = require('..');
var expect = require('expectations');

describe('Clock instance', function() {
	var timeoutInvoked;

	beforeEach(function() {
		clock.install();

		timeoutInvoked = false;

		setTimeout(function() {
			timeoutInvoked = true;
		}, 1000);
	});

	afterEach(function() {
		clock.uninstall();
	});

	it('has been correctly exported', function() {
		expect(timeoutInvoked).toBeFalsy();
		clock.tick(1000);
		expect(timeoutInvoked).toBeTruthy();
	});
});
