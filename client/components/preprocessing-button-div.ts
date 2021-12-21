/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_preprocessing_div.ts'/>

var logger = require('../modules/logger');
var mpcPreprocessingdiv = require('../mpc/mpc_preprocessing_div');

exports.preprocessing_button_div = function (app :any) {
  app.component('preprocessing-button-div', {
    data() {
      return {
        preprocessingButtonEnabled: true,
      }
    },
    methods: {
      preprocessingButtonClick() {
        logger.log("Starte Preprocessing...", logger.LogType.INFO);
        this.preprocessingButtonEnabled = false;
        mpcPreprocessingdiv.mpc_preprocessing_div();
        logger.log("Preprocessing abgeschlossen!", logger.LogType.INFO);
      }
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
