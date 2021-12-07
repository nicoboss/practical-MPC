/// <reference path="../node_modules/vue/ref-macros.d.ts" />

var tabs = ['A', 'B', 'C'];

exports.vue_test = function (app :any) {
  app.component('vue-test', {
    data() {
      return {
        count: 0,
        tabs,
        selectedTab: 'A',
      }
    },
    template: `
      <button id="vue-test-button" v-on:click="count++">
        {{ count }}
      </button>
      <tabs v-model="selectedTab">
        <tab
          class="tab"
          v-for="(tab, i) in tabs"
          :val="tab"
          :label="tab"
          :indicator="true"/>
      </tabs>
      <tab-panels v-model="selectedTab" :animate="true">
        <tab-panel
        v-for="(tab, i) in tabs"
        :val="tab">
          {{ tab }}{{ tab }}{{ tab }}
        </tab-panel>
      </tab-panels>`
  })
}
