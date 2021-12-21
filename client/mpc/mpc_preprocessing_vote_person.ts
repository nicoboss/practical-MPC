/// <reference path="../jiff-mpc/jiff-client.d.ts" />
/// <reference path='../mpc/mpc_connect.ts'/>

var connectButton = require('../mpc/mpc_connect');

exports.mpc_preprocessing_vote_person = function (input :any, jiff_instance:any) {
  if (jiff_instance == null) {
    jiff_instance = connectButton.saved_instance;
  }
  jiff_instance.preprocessing('open', 4);
  jiff_instance.executePreprocessing(function () {
  });
};
