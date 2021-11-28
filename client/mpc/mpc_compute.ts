import { smult, sadd } from '../jiff-mpc/client/protocols/bits/arithmetic';
/// <reference path="../jiff-mpc/jiff-client.d.ts" />
/// <reference path='../mpc/mpc_connect.ts'/>

var connectButton = require('../mpc/mpc_connect');

// Lose basierend auf https://github.com/multiparty/jiff/tree/master/demos
exports.mpc_compute = function (input :any, jiff_instance :any, ) {
  if (jiff_instance == null) {
    jiff_instance = connectButton.saved_instance;
  }
  // MPC implementierung
  var shares = jiff_instance.share(input);
  var sum = shares[1];
  if ((<HTMLInputElement>document.getElementById("calculate_sum")).checked) {
    for (var i = 2; i <= jiff_instance.party_count; i++) {
      sum = sum.sadd(shares[i]);
    }
  } else if ((<HTMLInputElement>document.getElementById("calculate_multi")).checked) {
    for (var i = 2; i <= jiff_instance.party_count; i++) {
      sum = sum.smult(shares[i]);
    }
  }
  return jiff_instance.open(sum);
};
