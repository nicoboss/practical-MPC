/// <reference path="../jiff-mpc/jiff-client.d.ts" />
/// <reference path='../modules/logger.ts'/>

var logger = require('../modules/logger');

exports.mpc_preprocessing_vote_gpu = function (app: any) {
  logger.log("Starte Preprocessing...", logger.LogType.INFO);
  let jiff_instance = app.config.globalProperties.$saved_instance;
  jiff_instance.seed_ids('4');
  let security_checks = (<HTMLInputElement>document.getElementById("vote_gpu_security_checks")).checked;
  if (security_checks) {
    jiff_instance.preprocessing('clteq', jiff_instance.party_count * 4 + 1); // 1 + party_count * 4
    jiff_instance.preprocessing('smult', jiff_instance.party_count * 4 + 4); // party_count * 4 + 4
  }
  jiff_instance.preprocessing('open', 4);
  jiff_instance.executePreprocessing(function () {
    let jiff_instance = app.config.globalProperties.$saved_instance;
    jiff_instance.seed_ids('');
    app.config.globalProperties.$externalMethods.call('submit_button_vote_gpu.SetEnabled', true);
    logger.log("Preprocessing abgeschlossen!", logger.LogType.INFO);
  });
};
