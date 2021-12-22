/// <reference path="../jiff-mpc/jiff-client.d.ts" />

// Basierend auf https://github.com/multiparty/jiff/blob/master/demos/standard-deviation/mpc.js
exports.mpc_compute = function (app: any, input: number) {
  let jiff_instance = app.config.globalProperties.$saved_instance;
  let n = jiff_instance.party_count;

  // MPC implementierung
  let input_squared = input * input;
  let shares = jiff_instance.share(input);
  let squared_shares = jiff_instance.share(input_squared);
  let sum = shares[1];
  let sum_squares = squared_shares[1];
  for (let i = 2; i <= jiff_instance.party_count; i++) {
    sum = sum.sadd(shares[i]);
    sum_squares = sum_squares.sadd(squared_shares[i]);
  }

  let squared_sum = sum.smult(sum, undefined, false);
  sum_squares = sum_squares.cmult(n, undefined, false);
  let diff = sum_squares.ssub(squared_sum);

  return jiff_instance.open(diff).then(function (diff: any) {
    return Math.sqrt((diff / (n * n)) * (n/(n-1)));
  });
};
