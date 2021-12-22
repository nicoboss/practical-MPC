/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../mpc/mpc_preprocessing_div.ts'/>

var mpcPreprocessingdiv = require('../mpc/mpc_preprocessing_div');

exports.preprocessing_button_div = function (app :any) {
  app.component('preprocessing-button-div', {
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
        mpcPreprocessingdiv.mpc_preprocessing_div();
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('preprocessing_button_div.SetEnabled', this.SetEnabled)
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
