/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../modules/logger.ts'/>
/// <reference path='../mpc/mpc_compute_vote_person.ts'/>

var logger = require('../modules/logger');
var mpcCompute = require('../mpc/mpc_compute_vote_person');

exports.submit_button_vote_person = function (app: any) {
  app.component('submit-button-vote-person', {
    data() {
      return {
        submitButtonEnabled: true,
      }
    },
    methods: {
      SetEnabled(newState :boolean) {
        this.submitButtonEnabled = newState;
      },
      submitButtonClick() {
        var _this = this;
        let input1 = (<HTMLInputElement>document.getElementById("vote_Maximilian_Holtzmann")).checked ? 1 : 0;
        let input2 = (<HTMLInputElement>document.getElementById("vote_Swen_Bachmeier")).checked ? 1 : 0;
        let input3 = (<HTMLInputElement>document.getElementById("vote_Andreas_Brandt")).checked ? 1 : 0;
        let input4 = (<HTMLInputElement>document.getElementById("vote_Joerg_Schuster")).checked ? 1 : 0;
        let inputs:number[] = [input1, input2, input3, input4];
        let security_checks = (<HTMLInputElement>document.getElementById("vote_person_security_checks")).checked;
        logger.log("Starten...", logger.LogType.INFO);
        this.submitButtonEnabled = false;
        let jiff_instance = app.config.globalProperties.$saved_instance;
        jiff_instance.seed_ids('4');
        var promise = mpcCompute.mpc_compute(app, inputs, security_checks);
        promise.then(function (result: number) {
          logger.log("Resultat: " + result, logger.LogType.RESULT);
          (<HTMLDivElement>document.getElementById("log_box")).scrollIntoView();
          setTimeout(() => 
          {
            let jiff_instance = app.config.globalProperties.$saved_instance;
            _this.submitButtonEnabled = jiff_instance.crypto_provider;
            app.config.globalProperties.$externalMethods.call('preprocessing_button_vote_person.SetEnabled', !jiff_instance.crypto_provider);
          },
          500);
        });
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('submit_button_vote_person.SetEnabled', this.SetEnabled)
    },
    template: `
      <button id="submit_button_vote_person" v-on:click="submitButtonClick()" v-bind:disabled="!submitButtonEnabled">
        Berechnen
      </button>`
  })
}
