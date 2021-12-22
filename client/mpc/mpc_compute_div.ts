/// <reference path="../jiff-mpc/jiff-client.d.ts" />

// Lose basierend auf https://github.com/multiparty/jiff/tree/master/demos
exports.mpc_compute = function (app: any, input: any) {
  let jiff_instance = app.config.globalProperties.$saved_instance;
  // MPC implementierung
  let shares = jiff_instance.share(input);
  let quotient = shares[1];
  for (let i = 2; i <= jiff_instance.party_count; i++) {
    quotient = quotient.sdiv(shares[i]);
  }
  return jiff_instance.open(quotient);
};
