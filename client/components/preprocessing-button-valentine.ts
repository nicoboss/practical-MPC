/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path='../mpc/mpc_preprocessing_valentine.ts'/>

var mpcPreprocessingvalentine = require('../mpc/mpc_preprocessing_valentine');

exports.preprocessing_button_valentine = function (app :any) {
  app.component('preprocessing-button-valentine', {
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
        mpcPreprocessingvalentine.mpc_preprocessing_valentine();
      }
    },
    mounted: function () {
      app.config.globalProperties.$externalMethods.register('preprocessing_button_valentine.SetEnabled', this.SetEnabled)
    },
    template: `
      <button name="preprocessing_button" v-on:click="preprocessingButtonClick()" v-bind:disabled="!preprocessingButtonEnabled">
        Preprocessing
      </button>`
  })
}
