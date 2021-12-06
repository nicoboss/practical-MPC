/// <reference path="../node_modules/vue/ref-macros.d.ts" />

var jsonSyntaxHighlight = require('../modules/jsonSyntaxHighlight');

var users = [];

exports.vue_logger = function (app :any) {
  app.component('vue-logger', {
    data() {
      return {
        users,
        connection: null,
        connectButtonEnabled: true,
        selectedRows: [],
        filters: {
          loggerProtocol: { value: { ClientToServer: true, ServerToClient: true, ServerToLogger: true, ClientToLogger: true }, custom: this.ageFilter }
        }
      }
    },
    methods: {
      ageFilter (filterValue, row) {
        var comp = !(row.loggerProtocol in filterValue) || filterValue[row.loggerProtocol] === true;
        console.log(JSON.stringify(filterValue) + " | " + JSON.stringify(row) + " | " + row.loggerProtocol + " | " + comp);
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
              'time': new Date(),
              'html': jsonSyntaxHighlight.syntaxHighlight(JSON.stringify(loggerMsgObj, undefined, 2)),
              "loggerProtocol": "loggerProtocol" in loggerMsgObj ? loggerMsgObj.loggerProtocol : "",
              "sender_party_id": "sender_party_id" in loggerMsgObj ? loggerMsgObj.sender_party_id : "",
              "receiver_party_id": "receiver_party_id" in loggerMsgObj ? loggerMsgObj.receiver_party_id : "",
              "socketProtocol": "socketProtocol" in loggerMsgObj.message ? loggerMsgObj.message.socketProtocol : "",
              "party_id": "party_id" in loggerMsgObj.message.data ? loggerMsgObj.message.data.party_id : "",
              "share": "share" in loggerMsgObj.message.data ? loggerMsgObj.message.data.share : "",
              "op_id": "op_id" in loggerMsgObj.message.data ? loggerMsgObj.message.data.op_id : default_op_id,
              "Zp": "Zp" in loggerMsgObj.message.data ? loggerMsgObj.message.data.Zp : "",
            };
          _this.users.push(tableRowObj);
        }
    
        conn.onopen = function(event: any) {
          conn.send('register');
        }
        
      },
    },
    template: `
      <button id="connect_button" v-on:click="connectButtonClick()" v-bind:disabled="!connectButtonEnabled">
        Verbinden!
      </button>
      <label>Filtern:</label>
      <input v-model.number="filters.loggerProtocol.value.ClientToServer" type="checkbox" id="ClientToServerFilter" checked>
      <label for="ClientToServerFilter">ClientToServer</label>
      <input v-model.number="filters.loggerProtocol.value.ServerToClient" type="checkbox" id="ServerToClientFilter" checked>
      <label for="ServerToClientFilter">ServerToClient</label>
      <input v-model.number="filters.loggerProtocol.value.ServerToLogger" type="checkbox" id="ServerToLogger" checked>
      <label for="ServerToLoggerFilter">ServerToLogger</label>
      <input v-model.number="filters.loggerProtocol.value.ClientToLogger" type="checkbox" id="ClientToLogger" checked>
      <label for="ClientToLoggerFilter">ClientToLogger</label>
      <button v-on:click="selectAll()">Select All</button>
      <button v-on:click="deselectAll()">Deselect All</button>
      <VTable
      ref="usersTable"
      :data="users"
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
          <VTh sortKey="share">share</VTh>
          <VTh sortKey="op_id">op_id</VTh>
          <VTh sortKey="Zp">Zp</VTh>
        </template>
        <template #body="{ rows }">
          <VTr
          v-for="row in rows"
          :key="rows"
          :row="row">
            <td>{{ row.time }}</td>
            <td>{{ row.loggerProtocol }}</td>
            <td>{{ row.sender_party_id }}</td>
            <td>{{ row.receiver_party_id }}</td>
            <td>{{ row.socketProtocol }}</td>
            <td>{{ row.party_id }}</td>
            <td>{{ row.share }}</td>
            <td>{{ row.op_id }}</td>
            <td>{{ row.Zp }}</td>
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
