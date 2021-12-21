/// <reference path="../jiff-mpc/jiff-client.d.ts" />
/// <reference path='../mpc/mpc_connect.ts'/>

var connectButton = require('../mpc/mpc_connect');

exports.mpc_preprocessing_div = function (input :any, jiff_instance:any) {
  if (jiff_instance == null) {
    jiff_instance = connectButton.saved_instance;
  }
  let party_count = parseInt((<HTMLInputElement>document.getElementById("party_count")).value);
  jiff_instance.preprocessing('sdiv', party_count-1);
  jiff_instance.preprocessing('open', 1);
  jiff_instance.executePreprocessing(function () {
  });
};
