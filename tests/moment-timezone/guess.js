"use strict";

var tz = require("../../").tz;

var getTimezoneOffset = Date.prototype.getTimezoneOffset;

function mockTimezoneOffset (zone) {
	Date.prototype.getTimezoneOffset = function () {
		return zone.offset(+this);
	};
}

exports.guess = {
	tearDown : function (done) {
		Date.prototype.getTimezoneOffset = getTimezoneOffset;
		done();
	},

	"different offsets should guess different timezones" : function (test) {
		mockTimezoneOffset(tz.zone('Europe/London'));
		var london = tz.guess(true);
		mockTimezoneOffset(tz.zone('America/New_York'));
		var newYork = tz.guess(true);
		mockTimezoneOffset(tz.zone('America/Los_Angeles'));
		var losAngeles = tz.guess(true);

		test.ok(london);
		test.ok(newYork);
		test.ok(losAngeles);
		test.notEqual(london, newYork);
		test.notEqual(london, losAngeles);
		test.done();
	},

	"ensure each zone is represented" : function (test) {
		var names = tz.names();
		var zone, i;

		for (i = 0; i < names.length; i++) {
			zone = tz.zone(names[i]);
			mockTimezoneOffset(zone);
			test.ok(tz.guess(true), "Should have a guess for " + zone.name + ")");
		}
		test.done();
	}
};
