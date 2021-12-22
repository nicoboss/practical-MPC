/// <reference path="../jiff-mpc/jiff-client.d.ts" />
/// <reference path='../modules/logger.ts'/>

var logger = require('../modules/logger');

exports.mpc_preprocessing_multi = function (app :any) {
  logger.log("Starte Preprocessing...", logger.LogType.INFO);
  let jiff_instance = app.config.globalProperties.$saved_instance;
  let party_count = parseInt((<HTMLInputElement>document.getElementById("party_count")).value);
  jiff_instance.preprocessing('open', 1);
  jiff_instance.preprocessing('smult', party_count-1);
  jiff_instance.executePreprocessing(function () {
    app.config.globalProperties.$externalMethods.call('submit_button_multi.SetEnabled', true);
    logger.log("Preprocessing abgeschlossen!", logger.LogType.INFO);
  });
};
