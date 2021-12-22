/// <reference path="../jiff-mpc/jiff-client.d.ts" />

var JIFFClient = require('../jiff-mpc/jiff-client');
var jiff_websockets = require('../jiff-mpc/ext/jiff-client-websockets');

// Lose basierend auf https://github.com/multiparty/jiff/tree/master/demos/sum
exports.mpc_connect = function (app: any, hostname: string, computation_id: string, use_crypto_provider: boolean, options: any) {
  var opt = Object.assign({}, options);
  opt.crypto_provider = use_crypto_provider
  opt.Zp = Number((<HTMLInputElement>document.getElementById("Zp_input")).value);
  let saved_instance = new JIFFClient(hostname, computation_id, opt);
  var secure_communication: boolean;
  secure_communication = (<HTMLInputElement>document.getElementById("secure_communication")).checked;
  if (!secure_communication) {
    saved_instance.sodium_ = false;
  }
  saved_instance.apply_extension(jiff_websockets, opt);
  app.config.globalProperties.$saved_instance = saved_instance;
};
