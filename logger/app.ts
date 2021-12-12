/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/vue/ref-macros.d.ts" />
/// <reference path="node_modules/vuejs-smart-table/dist/types/index.d.ts" />
/// <reference path='components/vue-test.ts'/>
/// <reference path='components/server-address.ts'/>
/// <reference path='components/vue-logger.ts'/>

var vueTest = require('./components/vue-test');
var serverAddress = require('./components/server-address');
var vueLogger = require('./components/vue-logger');
import { createApp } from 'vue';

const app = createApp({});

var SmartTable = require('vuejs-smart-table');
SmartTable.install(app)

vueTest.vue_test(app);
serverAddress.server_address(app);
vueLogger.vue_logger(app);

app.mount('#main_app');
