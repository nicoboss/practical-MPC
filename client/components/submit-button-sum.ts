/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_sum.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_sum');

exports.submit_button_sum = function (app :any) {
  app.component('submit-button-sum', {
    data() {
      return {
        submitButtonEnabled: true,
      }
    },
    methods: {
      submitButtonClick() {
        let input = parseInt((<HTMLInputElement>document.getElementById("client_input_sum")).value);
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        var promise = mpcCompute.mpc_compute(input);
        promise.then(handleResultSum);
      }
    },
    template: `
      <button id="submit_button" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}

function handleResultSum(result: any) {
  logger.log("Resultat: " + result, logger.LogType.RESULT);
}
