/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_valentine.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_valentine');

exports.submit_button_valentine = function (app :any) {
  app.component('submit-button-valentine', {
    data() {
      return {
        submitButtonEnabled: true,
      }
    },
    methods: {
      submitButtonClick() {
        let input = (<HTMLInputElement>document.getElementById("ValentineYes")).checked ? 1 : 0;
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        var promise = mpcCompute.mpc_compute(input);
        promise.then(handleResultValentine);
      }
    },
    template: `
      <button id="submit_button" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}

function handleResultValentine(result: any) {
  logger.log("Resultat: " + result, logger.LogType.RESULT);
}