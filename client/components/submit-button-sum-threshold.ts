/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_sum_threshold.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_sum_threshold');

exports.submit_button_sum_threshold = function (app :any) {
  app.component('submit-button-sum-threshold', {
    data() {
      return {
        submitButtonEnabled: true,
      }
    },
    methods: {
      submitButtonClick() {
        let input = parseInt((<HTMLInputElement>document.getElementById("client_input_threshold_sum")).value);
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        var promise = mpcCompute.mpc_compute(input);
        promise.then(handleResultSumThreshold);
      }
    },
    template: `
      <button id="submit_button" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}

function handleResultSumThreshold(result: any) {
  logger.log("Resultat: " + result, logger.LogType.RESULT);
}
