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
  if ((<HTMLInputElement>document.getElementById("calculate_sum")).checked) {
    var shares = jiff_instance.share(input);
    var sum = shares[1];
    for (var i = 2; i <= jiff_instance.party_count; i++) {
      sum = sum.sadd(shares[i]);
    }
    return jiff_instance.open(sum);
  }
  if ((<HTMLInputElement>document.getElementById("calculate_multi")).checked) {
    var shares = jiff_instance.share(input);
    var sum = shares[1];
    for (var i = 2; i <= jiff_instance.party_count; i++) {
      sum = sum.smult(shares[i]);
    }
    return jiff_instance.open(sum);
  }
  if ((<HTMLInputElement>document.getElementById("calculate_voting")).checked) {
    var this_count = 4
    var inputs:number[] = new Array(this_count).fill(0);
    inputs[input-1] = 1;
    var calculate_voting_promise = jiff_instance.share_array(inputs).then(function (option_shares: any) {
      jiff_instance.seed_ids(this_count);
      var results = option_shares[1].slice();

      var i, j;
      // Get a partial tally for each option in the vote by adding the shares across parties together.
      for (j = 2; j <= jiff_instance.party_count; j++) {
        for (i = 0; i < option_shares[j].length; i++) {
          results[i] = results[i].sadd(option_shares[j][i]);
        }
      }

      if ((<HTMLInputElement>document.getElementById("security_checks")).checked) {
        // Jede einzelne Abstimmungsoption muss kleiner oder gleich 1 sein
        var check = option_shares[1][0].clteq(1);
        for (j = 1; j <= jiff_instance.party_count; j++) {
          for (i = 0; i < option_shares[j].length; i++) {
            check = check.smult(option_shares[j][i].clteq(1));
          }
        }
  
        // Jede Partei erhält nur eine Stimme: Die Summe aller Stimmen einer Partei sollte kleiner oder gleich 1 sein
        for (j = 1; j <= jiff_instance.party_count; j++) {
          var sum = option_shares[j][0];
          for (i = 1; i < option_shares[j].length; i++) {
            sum = sum.sadd(option_shares[j][i]);
          }
          check = check.smult(sum.clteq(1));
        }
        
        // Wenn eine Prüfung fehlschlägt: Alle Simmen auf 0 setzen
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
  }
  if ((<HTMLInputElement>document.getElementById("calculate_threshold")).checked) {
    var threshold = Number((<HTMLInputElement>document.getElementById("threshold_input")).value)
    var shares = jiff_instance.share(input);
    var sum = shares[1].cgt(threshold);
    for (var i = 2; i <= jiff_instance.party_count; i++) {
      sum = sum.sadd(shares[i].cgt(threshold));
    }
    return jiff_instance.open(sum);
  }
  return null;
};
