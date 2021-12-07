/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_vote.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_vote');

exports.submit_button_vote = function (app :any) {
  app.component('submit-button-vote', {
    data() {
      return {
        submitButtonEnabled: true,
      }
    },
    methods: {
      submitButtonClick() {
        let input1 = (<HTMLInputElement>document.getElementById("VotedCandidate1")).checked ? 1 : 0;
        let input2 = (<HTMLInputElement>document.getElementById("VotedCandidate2")).checked ? 1 : 0;
        let input3 = (<HTMLInputElement>document.getElementById("VotedCandidate3")).checked ? 1 : 0;
        let input4 = (<HTMLInputElement>document.getElementById("VotedCandidate4")).checked ? 1 : 0;
        let inputs:number[] = [input1, input2, input3, input4];
        let security_checks = (<HTMLInputElement>document.getElementById("security_checks")).checked;
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        var promise = mpcCompute.mpc_compute(inputs, security_checks);
        promise.then(handleResultVote);
      }
    },
    template: `
      <button id="submit_button" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}

function handleResultVote(result: any) {
  logger.log("Resultat: " + result, logger.LogType.RESULT);
}
