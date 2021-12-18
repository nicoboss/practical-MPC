/// <reference path="../node_modules/vue/ref-macros.d.ts" />
/// <reference path="../node_modules/dayjs/index.d.ts" />

var jsonSyntaxHighlight = require('../modules/jsonSyntaxHighlight');
var dayjs = require('dayjs')

var users = [];
var data_buffer = [];
var last_data_buffer_update: Date = new Date();

exports.vue_logger = function (app :any) {
  app.component('vue-logger', {
    data() {
      return {
        users,
        totalPages: 1,
        currentPage: 1,
        data_buffer,
        last_data_buffer_update,
        connection: null,
        connectButtonEnabled: true,
        selectedRows: [],
        filters: {
          loggerProtocol: { value: { ClientToServer: true, ServerToClient: true, ServerToLogger: true, ClientToLogger: true }, custom: this.ageFilter }
        }
      }
    },
    mounted: function () {
      window.setInterval(() => {
        if (data_buffer.length > 0) {
          var startTime: Date = this.last_data_buffer_update;
          var endTime: Date = new Date();
          var timeDiff = endTime.getTime() - startTime.getTime();
          if (timeDiff > 250) {
            this.users.push(...this.data_buffer);
            this.data_buffer = [];
          }
        }
      }, 100)
    },
    methods: {
      ageFilter (filterValue, row) {
        var comp = !(row.loggerProtocol in filterValue) || filterValue[row.loggerProtocol] === true;
        return comp;
      },
      selectAll () {
        this.$refs.usersTable.selectAll();
      },
      deselectAll () {
        this.$refs.usersTable.deselectAll();
      },
      sendMessage: function(message: any) {
        this.connection.send(message);
      },
      connectButtonClick() {
        var _this = this;
        this.connectButtonEnabled = false;
        let hostname = (<HTMLInputElement>document.getElementById("server_address")).value;
        let conn = new WebSocket(hostname);
        this.connection = conn;
    
        conn.onmessage = function(event: any) {
          var loggerMsgObj = JSON.parse(event.data);
          if (loggerMsgObj.loggerProtocol == "ClientToServer" || loggerMsgObj.loggerProtocol == "ServerToClient") {
            var socketMsgObj = JSON.parse(loggerMsgObj.message);
            var dataMsgObj = JSON.parse(socketMsgObj.data);
            socketMsgObj.data = dataMsgObj;
            loggerMsgObj.message = socketMsgObj;
          }

          if (!("message" in loggerMsgObj)) loggerMsgObj.message = {};
          var default_op_id = "";
          if (typeof loggerMsgObj.message === 'string' || loggerMsgObj.message instanceof String) {
            default_op_id = loggerMsgObj.message;
            loggerMsgObj.message = {};
          }
          if (!("data" in loggerMsgObj.message)) loggerMsgObj.message.data = {};

          var tableRowObj =  {
              'time': dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSS'),
              'html': jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2)),
              "loggerProtocol": "loggerProtocol" in loggerMsgObj ? loggerMsgObj.loggerProtocol : "",
              "sender_party_id": "sender_party_id" in loggerMsgObj ? loggerMsgObj.sender_party_id : "",
              "receiver_party_id": "receiver_party_id" in loggerMsgObj ? loggerMsgObj.receiver_party_id : "",
              "socketProtocol": "socketProtocol" in loggerMsgObj.message ? loggerMsgObj.message.socketProtocol : "",
              "party_id": "party_id" in loggerMsgObj.message.data ? loggerMsgObj.message.data.party_id : "",
              "shares":
                "shares" in loggerMsgObj.message.data
                  ? loggerMsgObj.message.data.shares
                  : "share" in loggerMsgObj.message.data
                    ? typeof loggerMsgObj.message.data.share === 'string' || loggerMsgObj.message.data.share instanceof String
                      ? loggerMsgObj.message.data.share
                      : "Encrypted"
                    : "",
              "op_id": "op_id" in loggerMsgObj.message.data ? loggerMsgObj.message.data.op_id : default_op_id,
            };
          _this.data_buffer.push(tableRowObj);
          _this.last_data_buffer_update = new Date();
        }
    
        conn.onopen = function(event: any) {
          conn.send('register');
        }
        
      },
    },
    template: `
      <button class="button-x connect-button" id="connect_button" v-on:click="connectButtonClick()" v-bind:disabled="!connectButtonEnabled">
        Verbinden
      </button>

      <br/>
      <br/>

      <h4>Filtern:</h4>

      <br/>

      <div class="d-grid">

        <div class="d-flex">
          <label class="filter-label" for="ClientToServerFilter">ClientToServer</label>
          <input class="filter-checkbox" v-model.number="filters.loggerProtocol.value.ClientToServer" type="checkbox" id="ClientToServerFilter" checked>
        </div>

        <div class="d-flex">
          <label class="filter-label" for="ServerToClientFilter">ServerToClient</label>
          <input class="filter-checkbox" v-model.number="filters.loggerProtocol.value.ServerToClient" type="checkbox" id="ServerToClientFilter" checked>
        </div>

        <div class="d-flex">
          <label class="filter-label" for="ServerToLoggerFilter">ServerToLogger</label>
          <input class="filter-checkbox" v-model.number="filters.loggerProtocol.value.ServerToLogger" type="checkbox" id="ServerToLogger" checked>
        </div>

        <div class="d-flex">
          <label class="filter-label" for="ClientToLoggerFilter">ClientToLogger</label>
          <input class="filter-checkbox" v-model.number="filters.loggerProtocol.value.ClientToLogger" type="checkbox" id="ClientToLogger" checked>
        </div>

      </div>

      <br/>
      <br/>

      <div>
        <button class="button-x button-x-selectbuttons" v-on:click="selectAll()">Alle anwählen</button>
        <button class="button-x button-x-selectbuttons" v-on:click="deselectAll()">Alle abwählen</button>
      </div>

      <br/>
      <br/>

      <VTPagination class="d-flex justify-content-center"
      v-model:currentPage="currentPage"
      :total-pages="totalPages"
      :boundary-links="true"/>
      <VTable
      ref="usersTable"
      :data="users"
      :page-size="20"
      v-model:currentPage="currentPage"
      @totalPagesChanged="totalPages = $event"
      :filters="filters"
      :hideSortIcons="false"
      selectionMode="multiple"
      selectedClass="selected-row"
      @stateChanged="selectedRows = $event.selectedRows">
        <template #head>
          <VTh sortKey="time">time</VTh>
          <VTh sortKey="loggerProtocol">loggerProtocol</VTh>
          <VTh sortKey="sender_party_id">sender</VTh>
          <VTh sortKey="receiver_party_id">receiver</VTh>
          <VTh sortKey="socketProtocol">socketProtocol</VTh>
          <VTh sortKey="party_id">party_id</VTh>
          <VTh sortKey="shares">shares</VTh>
          <VTh sortKey="op_id">op_id</VTh>
        </template>
        <template #body="{ rows }">
          <VTr
          v-for="row in rows"
          :row="row">
            <td>{{ row.time }}</td>
            <td>{{ row.loggerProtocol }}</td>
            <td>{{ row.sender_party_id }}</td>
            <td>{{ row.receiver_party_id }}</td>
            <td>{{ row.socketProtocol }}</td>
            <td>{{ row.party_id }}</td>
            <td>{{ row.shares }}</td>
            <td>{{ row.op_id }}</td>
          </VTr>
        </template>
      </VTable>
      <strong>Selected:</strong>
      <div v-if="selectedRows.length === 0">
        Nichts ausgewählt
      </div>
      <div v-for="selected in selectedRows">
        <pre v-html="selected.html"></pre>
      </div>`
  })
}
