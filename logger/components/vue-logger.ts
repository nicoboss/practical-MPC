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
          loggerProtocol: {
            value: {
              ClientToServer: true,
              ServerToClient: true,
              ServerToLogger: true,
              ClientToLogger: true,
            },
            custom: this.loggerProtocolFilter,
          },
          socketProtocol: {
            value: {
              initialization: true,
              public_keys: true,
              share: true,
              crypto_provider: true,
              open: true,
              custom: true
            },
            custom: this.socketProtocolFilter,
          },
          sender: {
            value: 0,
            custom: this.senderFilter,
          },
          receiver: {
            value: 0,
            custom: this.receiverFilter,
          }
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
      loggerProtocolFilter(filterValue, row) {
        var comp = !(row.loggerProtocol in filterValue) || filterValue[row.loggerProtocol] === true;
        return comp;
      },
      socketProtocolFilter(filterValue, row) {
        var comp = !(row.socketProtocol in filterValue) || filterValue[row.socketProtocol] === true;
        return comp;
      },
      senderFilter(filterValue, row) {
        if (filterValue === 0 || row.sender_party_id === "") {
          return true;
        }
        let sender_party_id = Number(row.sender_party_id);
        let comp = sender_party_id === filterValue;
        return comp;
      },
      receiverFilter(filterValue, row) {
        if (filterValue === 0 || row.receiver_party_id === "") {
          return true;
        }
        let receiver_party_id = Number(row.receiver_party_id);
        let comp = receiver_party_id === filterValue;
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
              'html': jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2)),
              'time': "loggerProtocol" in loggerMsgObj ? dayjs(loggerMsgObj.time).format('YYYY-MM-DD HH:mm:ss:SSS') : dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSS'),
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

      <br/><br/>
      <h4>Filtern:</h4>
      <br/>

      <div class="d-flex">

        <div class="box">
          <b><p class="filter-title">Logger Protocol Filter:</p></b>

          <div class="d-flex align-center">
            <label class="filter-label" for="ClientToServerFilter">ClientToServer</label>
            <input class="filter-checkbox" v-model.number="filters.loggerProtocol.value.ClientToServer" type="checkbox" id="ClientToServerFilter" checked>
          </div>
  
          <div class="d-flex align-center">
            <label class="filter-label" for="ServerToClientFilter">ServerToClient</label>
            <input class="filter-checkbox" v-model.number="filters.loggerProtocol.value.ServerToClient" type="checkbox" id="ServerToClientFilter" checked>
          </div>
  
          <div class="d-flex align-center">
            <label class="filter-label" for="ServerToLoggerFilter">ServerToLogger</label>
            <input class="filter-checkbox" v-model.number="filters.loggerProtocol.value.ServerToLogger" type="checkbox" id="ServerToLoggerFilter" checked>
          </div>
  
          <div class="d-flex align-center">
            <label class="filter-label" for="ClientToLoggerFilter">ClientToLogger</label>
            <input class="filter-checkbox" v-model.number="filters.loggerProtocol.value.ClientToLogger" type="checkbox" id="ClientToLoggerFilter" checked>
          </div>
        </div>

        <div class="box">
          <b><p class="filter-title">Socket Protocol Filter:</p></b>

          <div class="d-flex align-center">
            <label class="filter-label" for="initializationFilter">initialization</label>
            <input class="filter-checkbox" v-model.number="filters.socketProtocol.value.initialization" type="checkbox" id="initializationFilter" checked>
          </div>
  
          <div class="d-flex align-center">
            <label class="filter-label" for="publicKeysFilter">public_keys</label>
            <input class="filter-checkbox" v-model.number="filters.socketProtocol.value.public_keys" type="checkbox" id="publicKeysFilter" checked>
          </div>
  
          <div class="d-flex align-center">
            <label class="filter-label" for="shareFilter">share</label>
            <input class="filter-checkbox" v-model.number="filters.socketProtocol.value.share" type="checkbox" id="shareFilter" checked>
          </div>
  
          <div class="d-flex align-center">
            <label class="filter-label" for="cryptoProviderFilter">crypto_provider</label>
            <input class="filter-checkbox" v-model.number="filters.socketProtocol.value.crypto_provider" type="checkbox" id="cryptoProviderFilter" checked>
          </div>
  
          <div class="d-flex align-center">
            <label class="filter-label" for="openFilter">open</label>
            <input class="filter-checkbox" v-model.number="filters.socketProtocol.value.open" type="checkbox" id="openFilter" checked>
          </div>
  
          <div class="d-flex align-center">
            <label class="filter-label" for="customFilter">custom</label>
            <input class="filter-checkbox" v-model.number="filters.socketProtocol.value.custom" type="checkbox" id="customFilter" checked>
          </div>
        </div>

        <div class="box">
          <b><p class="filter-title">Sender/Receiver Filter:</p></b>

          <div class="d-flex align-center padding-items">
            <label class="filter-label" for="senderFilter">Sender:</label>
            <input class="filter-number" v-model.number="filters.sender.value" type="number" min="0" id="senderFilter">
          </div>
  
          <div class="d-flex align-center padding-items">
            <label class="filter-label" for="receiverFilter">Receiver:</label>
            <input class="filter-number" v-model.number="filters.receiver.value" type="number" min="0" id="receiverFilter">
          </div>
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

      <VTPagination class="d-flex justify-content-left"
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
      <br/>
      <h2>Rohdaten:</h2>
      <div v-if="selectedRows.length === 0">Nichts ausgewählt</div>
      <div v-for="selected in selectedRows">
        <pre v-html="selected.html"></pre>
      </div>`
  })
}
