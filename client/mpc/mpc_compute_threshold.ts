/// <reference path="../jiff-mpc/jiff-client.d.ts" />

// Lose basierend auf https://github.com/multiparty/jiff/tree/master/demos
exports.mpc_compute = function (app: any, input: number) {
  let jiff_instance = app.config.globalProperties.$saved_instance;
  // MPC implementierung
  let threshold = Number((<HTMLInputElement>document.getElementById("threshold_input")).value)
  let shares = jiff_instance.share(input);
  let sum = shares[1].cgt(threshold);
  for (let i = 2; i <= jiff_instance.party_count; i++) {
    sum = sum.sadd(shares[i].cgt(threshold));
  }
  return jiff_instance.open(sum);
};
