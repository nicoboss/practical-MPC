/// <reference path="../jiff-mpc/jiff-client.d.ts" />

// Lose basierend auf https://github.com/multiparty/jiff/tree/master/demos
exports.mpc_compute = function (app: any, input: number) {
  let jiff_instance = app.config.globalProperties.$saved_instance;
  // MPC implementierung
  var shares = jiff_instance.share(input);
  shares = shares[1].mult(shares[2]);
  return shares.open();
};
