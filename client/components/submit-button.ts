/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute');

exports.submit_button = function (app :any) {
  app.component('submit-button', {
    data() {
      return {
        submitButtonEnabled: true,
      }
    },
    methods: {
      submitButtonClick() {
        let input = parseInt((<HTMLInputElement>document.getElementById("client_input")).value);
        if (isNaN(input)) {
          logger.log("Der input muss eine gültige Zahl sein!", logger.LogType.ERROR);
          return;
        }
        if (100 < input || input < 0 || input !== Math.floor(input)) {
          logger.log("Die Eingabe muss eine Ganzzahl zwischen 0 und 100 sein!", logger.LogType.ERROR);
          return;
        }
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        var promise = mpcCompute.mpc_compute(input);
        promise.then(handleResult);
      }
    },
    template: `
      <button id="submit_button" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}

function handleResult(result: any) {
  logger.log("Result is: " + result, logger.LogType.RESULT);
}
