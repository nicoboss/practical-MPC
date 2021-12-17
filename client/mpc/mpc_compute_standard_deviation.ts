/// <reference path="../jiff-mpc/jiff-client.d.ts" />
/// <reference path='../mpc/mpc_connect.ts'/>

var connectButton = require('../mpc/mpc_connect');

// Basierend auf https://github.com/multiparty/jiff/blob/master/demos/standard-deviation/mpc.js
exports.mpc_compute = function (input :any, jiff_instance :any, ) {
  if (jiff_instance == null) {
    jiff_instance = connectButton.saved_instance;
  }
  var n = jiff_instance.party_count;
  var precision = jiff_instance.decimal_digits;

  // MPC implementierung
  var input_squared = input * input;
  var shares = jiff_instance.share(input);
  var squared_shares = jiff_instance.share(input_squared);
  var sum = shares[1];
  var sum_squares = squared_shares[1];
  for (var i = 2; i <= jiff_instance.party_count; i++) {
    sum = sum.sadd(shares[i]);
    sum_squares = sum_squares.sadd(squared_shares[i]);
  }

  var squared_sum = sum.smult(sum, undefined, false);
  sum_squares = sum_squares.cmult(n, undefined, false);
  var diff = sum_squares.ssub(squared_sum);

  return jiff_instance.open(diff).then(function (diff: any) {
    return Math.sqrt((diff / (n * n)) * (n/(n-1)));
  });
};
