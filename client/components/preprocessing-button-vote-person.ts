/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../mpc/mpc_preprocessing_vote_person.ts'/>

var mpcPreprocessingvote_person = require('../mpc/mpc_preprocessing_vote_person');

exports.preprocessing_button_vote_person = function (app: any) {
  app.component('preprocessing-button-vote-person', {
    data() {
      return {
        preprocessingButtonEnabled: true,
      }
    },
    methods: {
      SetEnabled(newState :boolean) {
        this.preprocessingButtonEnabled = newState;
      },
      preprocessingButtonClick() {
        this.preprocessingButtonEnabled = false;
        mpcPreprocessingvote_person.mpc_preprocessing_vote_person(app);
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('preprocessing_button_vote_person.SetEnabled', this.SetEnabled)
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
