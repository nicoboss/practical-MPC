/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_preprocessing_sum.ts'/>

var logger = require('../modules/logger');
var mpcPreprocessingSum = require('../mpc/mpc_preprocessing_sum');

exports.preprocessing_button_sum = function (app :any) {
  app.component('preprocessing-button-sum', {
    data() {
      return {
        preprocessingButtonEnabled: true,
      }
    },
    methods: {
      preprocessingButtonClick() {
        logger.log("Starte Preprocessing...", logger.LogType.INFO);
        this.preprocessingButtonEnabled = false;
        mpcPreprocessingSum.mpc_preprocessing_sum();
        logger.log("Preprocessing abgeschlossen!", logger.LogType.INFO);
      }
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
