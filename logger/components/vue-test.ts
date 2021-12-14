/// <reference path="../node_modules/vue/ref-macros.d.ts" />

exports.vue_test = function (app :any) {
  app.component('vue-test', {
    data() {
      return {
        count: 0
      }
    },
    template: `
      <button class="button-x" id="vue-test-button" v-on:click="count++">
        {{ count }}
      </button>`
  })
}
