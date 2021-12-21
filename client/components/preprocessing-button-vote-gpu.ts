/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_preprocessing_vote_gpu.ts'/>

var logger = require('../modules/logger');
var mpcPreprocessingvote_gpu = require('../mpc/mpc_preprocessing_vote_gpu');

exports.preprocessing_button_vote_gpu = function (app :any) {
  app.component('preprocessing-button-vote-gpu', {
    data() {
      return {
        preprocessingButtonEnabled: true,
      }
    },
    methods: {
      preprocessingButtonClick() {
        logger.log("Starte Preprocessing...", logger.LogType.INFO);
        this.preprocessingButtonEnabled = false;
        mpcPreprocessingvote_gpu.mpc_preprocessing_vote_gpu();
        logger.log("Preprocessing abgeschlossen!", logger.LogType.INFO);
      }
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
