/// <reference path="../jiff-mpc/jiff-client.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_connect.ts'/>

var logger = require('../modules/logger');
var connectButton = require('../mpc/mpc_connect');

exports.mpc_preprocessing_sum = function (app :any) {
  logger.log("Starte Preprocessing...", logger.LogType.INFO);
  let jiff_instance = connectButton.saved_instance;
  jiff_instance.preprocessing('open', 1);
  jiff_instance.executePreprocessing(function () {
    app.config.globalProperties.$externalMethods.call('submit_button_sum.SetEnabled', true);
    logger.log("Preprocessing abgeschlossen!", logger.LogType.INFO);
  });
};
