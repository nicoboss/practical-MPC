/// <reference path="../jiff-mpc/jiff-client.d.ts" />

var JIFFClient = require('../jiff-mpc/jiff-client');
var jiff_websockets = require('../jiff-mpc/ext/jiff-client-websockets');

var saved_instance;

// Lose basierend auf https://github.com/multiparty/jiff/tree/master/demos/sum
exports.mpc_connect = function (hostname: string, computation_id: string, options: any) {
  var opt = Object.assign({}, options);
  var use_crypto_provider: boolean;
  use_crypto_provider = (<HTMLInputElement>document.getElementById("use_crypto_provider")).checked;
  opt.crypto_provider = use_crypto_provider
  saved_instance = new JIFFClient(hostname, computation_id, opt);
  saved_instance.apply_extension(jiff_websockets, opt);
  exports.saved_instance = saved_instance;
};
