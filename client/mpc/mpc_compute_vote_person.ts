/// <reference path="../jiff-mpc/jiff-client.d.ts" />

// Lose basierend auf https://github.com/multiparty/jiff/tree/master/demos
exports.mpc_compute = function (app: any, inputs :Array<number>, security_checks: boolean) {
  let jiff_instance = app.config.globalProperties.$saved_instance;
  // MPC implementierung
  var calculate_voting_promise = jiff_instance.share_array(inputs).then(function (option_shares: any) {
    jiff_instance.seed_ids(inputs.length);
    var results = option_shares[1].slice();

    var i, j;
    // Summe der Abstimmungsoption durch Zusammenzählen der Anteile der Parteien berechnen
    for (j = 2; j <= jiff_instance.party_count; j++) {
      for (i = 0; i < option_shares[j].length; i++) {
        results[i] = results[i].sadd(option_shares[j][i]);
      }
    }

    if (security_checks) {
      // Jede einzelne Abstimmungsoption muss kleiner oder gleich 1 sein
      var check = option_shares[1][0].clteq(1);
      for (j = 1; j <= jiff_instance.party_count; j++) {
        for (i = 0; i < option_shares[j].length; i++) {
          check = check.smult(option_shares[j][i].clteq(1));
        }
      }
  
      // Jede Partei erhält nur eine Stimme: Die Summe aller Stimmen einer Partei soll kleiner oder gleich 1 sein
      for (j = 1; j <= jiff_instance.party_count; j++) {
        var sum = option_shares[j][0];
        for (i = 1; i < option_shares[j].length; i++) {
          sum = sum.sadd(option_shares[j][i]);
        }
        check = check.smult(sum.clteq(1));
      }
        
      // Wenn eine Prüfung fehlschlägt: Alle Stimmen auf 0 setzen
      for (i = 0; i < results.length; i++) {
        results[i] = results[i].smult(check);
      }
    }

    var calculate_voting_open_promise = jiff_instance.open_array(results).then(function (results: any) {
      return results;
    });
    return Promise.resolve(calculate_voting_open_promise);
  });
  return Promise.resolve(calculate_voting_promise);
};
