/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_preprocessing_multi.ts'/>

var logger = require('../modules/logger');
var mpcPreprocessingmulti = require('../mpc/mpc_preprocessing_multi');

exports.preprocessing_button_multi = function (app :any) {
  app.component('preprocessing-button-multi', {
    data() {
      return {
        preprocessingButtonEnabled: true,
      }
    },
    methods: {
      preprocessingButtonClick() {
        logger.log("Starte Preprocessing...", logger.LogType.INFO);
        this.preprocessingButtonEnabled = false;
        mpcPreprocessingmulti.mpc_preprocessing_multi();
        logger.log("Preprocessing abgeschlossen!", logger.LogType.INFO);
      }
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
