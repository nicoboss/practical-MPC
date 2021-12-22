/// <reference path="../jiff-mpc/jiff-client.d.ts" />
/// <reference path='../modules/logger.ts'/>

var logger = require('../modules/logger');

exports.mpc_preprocessing_standard_deviation = function (app :any) {
  logger.log("Starte Preprocessing...", logger.LogType.INFO);
  let jiff_instance = app.config.globalProperties.$saved_instance;
  jiff_instance.preprocessing('smult', 1);
  jiff_instance.preprocessing('open', 1);
  jiff_instance.executePreprocessing(function () {
    app.config.globalProperties.$externalMethods.call('submit_button_standard_deviation.SetEnabled', true);
    logger.log("Preprocessing abgeschlossen!", logger.LogType.INFO);
  });
};
