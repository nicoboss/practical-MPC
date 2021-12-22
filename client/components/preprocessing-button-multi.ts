/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../mpc/mpc_preprocessing_multi.ts'/>

var mpcPreprocessingmulti = require('../mpc/mpc_preprocessing_multi');

exports.preprocessing_button_multi = function (app :any) {
  app.component('preprocessing-button-multi', {
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
        mpcPreprocessingmulti.mpc_preprocessing_multi();
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('preprocessing_button_multi.SetEnabled', this.SetEnabled)
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
