/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_preprocessing_sum_threshold.ts'/>

var logger = require('../modules/logger');
var mpcPreprocessingsum_threshold = require('../mpc/mpc_preprocessing_sum_threshold');

exports.preprocessing_button_sum_threshold = function (app :any) {
  app.component('preprocessing-button-sum-threshold', {
    data() {
      return {
        preprocessingButtonEnabled: true,
      }
    },
    methods: {
      preprocessingButtonClick() {
        logger.log("Starte Preprocessing...", logger.LogType.INFO);
        this.preprocessingButtonEnabled = false;
        mpcPreprocessingsum_threshold.mpc_preprocessing_sum_threshold();
        logger.log("Preprocessing abgeschlossen!", logger.LogType.INFO);
      }
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
