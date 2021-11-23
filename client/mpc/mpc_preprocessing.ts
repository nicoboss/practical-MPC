/// <reference path="../jiff-mpc/jiff-client.d.ts" />
/// <reference path='../mpc/mpc_connect.ts'/>

var connectButton = require('../mpc/mpc_connect');

exports.mpc_preprocessing = function (input :any, jiff_instance:any) {
  if (jiff_instance == null) {
    jiff_instance = connectButton.saved_instance;
  }
  console.log('Starte Preprocessing');
  jiff_instance.preprocessing('open', 0);
  jiff_instance.executePreprocessing(function () {
    console.log('Fertig mit Preprocessing');
  });
};
