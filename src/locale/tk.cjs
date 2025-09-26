"use strict";
exports.tk = void 0;
var _index = require("./tk/_lib/formatDistance.cjs");
var _index2 = require("./tk/_lib/formatLong.cjs");
var _index3 = require("./tk/_lib/formatRelative.cjs");
var _index4 = require("./tk/_lib/localize.cjs");
var _index5 = require("./tk/_lib/match.cjs");

const tk = (exports.tk = {
  code: "tk",
  formatDistance: _index.formatDistance,
  formatLong: _index2.formatLong,
  formatRelative: _index3.formatRelative,
  localize: _index4.localize,
  match: _index5.match,
  options: {
    weekStartsOn: 1 /* Monday */,
    firstWeekContainsDate: 1,
  },
});
