/// <reference path="../jiff-mpc/jiff-client.d.ts" />

// Lose basierend auf https://github.com/multiparty/jiff/tree/master/demos
exports.mpc_compute = function (app: any, input: number) {
  let jiff_instance = app.config.globalProperties.$saved_instance;
  // MPC implementierung
  var threshold = Number((<HTMLInputElement>document.getElementById("threshold_input_sum")).value)
  var shares = jiff_instance.share(input);
  console.log("mpc_compute_shares: " + JSON.stringify(shares));
  var sum = shares[1];
  for (var i = 2; i <= jiff_instance.party_count; i++) {
    sum = sum.sadd(shares[i]);
  }
  var is_sum_larger_than_threshold = sum.cgt(threshold);
  return jiff_instance.open(is_sum_larger_than_threshold);
};
