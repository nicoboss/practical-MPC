/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/vue/ref-macros.d.ts" />
/// <reference path='components/vue-test.ts'/>
/// <reference path='components/vue-logger.ts'/>

var vueTest = require('./components/vue-test');
var vueLogger = require('./components/vue-logger');

import { createApp } from 'vue';

const app = createApp({})

vueTest.vue_test(app);
vueLogger.vue_logger(app);

app.mount('#main_app')
