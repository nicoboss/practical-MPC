/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../mpc/mpc_preprocessing_vote_gpu.ts'/>

var mpcPreprocessingvote_gpu = require('../mpc/mpc_preprocessing_vote_gpu');

exports.preprocessing_button_vote_gpu = function (app :any) {
  app.component('preprocessing-button-vote-gpu', {
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
        mpcPreprocessingvote_gpu.mpc_preprocessing_vote_gpu();
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('preprocessing_button_vote_gpu.SetEnabled', this.SetEnabled)
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
