/// <reference path="../node_modules/vue/ref-macros.d.ts" />

var tabs = ['Summe', 'Multiplikation', 'Division', 'Valentine', 'Abstimmung', 'GPU-Wahl', 'Threshold', 'Sum Threshold', 'Standardabweichung' ];

exports.mpc_input = function (app :any) {
  app.component('mpc-input', {
    data() {
      return {
        tabs,
        selectedTab: 'Summe',
      }
    },
    template: `
      <tabs v-model="selectedTab">
        <tab
          class="tab"
          v-for="(tab, i) in tabs"
          :val="tab"
          :label="tab"
          :indicator="true"/>
      </tabs>
      <tab-panels v-model="selectedTab" :animate="true">
        <tab-panel val="Summe">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="client_input_sum">Summand:</label>
            <input type="number" id="client_input_sum" min="0" max="100" value="7"/>
            <submit-button-sum class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Multiplikation">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="client_input_multi">Faktor:</label>
            <input type="number" id="client_input_multi" min="0" max="100" value="7"/><br/>
            <submit-button-multi class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Division">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="client_input_div">Dividend/Divisor:</label>
            <input type="number" id="client_input_div" min="0" max="100" value="7"/><br/>
            <submit-button-div class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Valentine">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto">Liebst du die anderen Teilnehmer?</label><br/>
            <div class="d-flex">
              <input class="mtb-auto" type="radio" id="ValentineYes" name="IsValentine" checked="true"/>
              <label class="mtb-auto" for="IsValentine">Ja</label><br/>
            </div>
            <div class="d-flex">
              <input class="mtb-auto" type="radio" id="ValentineNo" name="IsValentine"/>
              <label class="mtb-auto" for="IsValentine">Nein</label><br/>
            </div>
            <submit-button-valentine class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Abstimmung">
          <div class="command-div d-flex">
            <label class="mtb-auto" for="vote_person_security_checks">Sicherheitschecks</label><input class="mtb-auto" type="checkbox" id="vote_person_security_checks" checked="true"/><br/>
            <div class="box">
              <input type="radio" id="vote_Maximilian_Holtzmann" name="VotedCandidate" checked="true"/><label for="VotedCandidate">Maximilian Holtzmann</label><br/>
              <input type="radio" id="vote_Swen_Bachmeier" name="VotedCandidate"/><label for="VotedCandidate">Swen Bachmeier</label><br/>
              <input type="radio" id="vote_Andreas_Brandt" name="VotedCandidate"/><label for="VotedCandidate">Andreas Brandt</label><br/>
              <input type="radio" id="vote_Joerg_Schuster" name="VotedCandidate"/><label for="VotedCandidate">Jörg Schuster</label><br/>
            </div>
            <submit-button-vote class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="GPU-Wahl">
          <div class="command-div d-flex">
            <label class="mtb-auto" for="vote_gpu_security_checks">Sicherheitschecks</label><input class="mtb-auto" type="checkbox" id="vote_gpu_security_checks" checked="true"/><br/>
            <div class="box">
              <input type="radio" id="vote_RTX_3080" name="GPU_Vote" checked="true"/><label for="GPU_Vote">NVIDIA GeForce RTX 3080</label><br/>
              <input type="radio" id="vote_RTX_3090" name="GPU_Vote"/><label for="GPU_Vote">NVIDIA GeForce RTX 3090</label><br/>
              <input type="radio" id="vote_RX_6800_XT" name="GPU_Vote"/><label for="GPU_Vote">AMD Radeon RX 6800 XT</label><br/>
              <input type="radio" id="vote_RX_6900_XT" name="GPU_Vote"/><label for="GPU_Vote">AMD Radeon RX 6900 XT</label><br/>
            </div>
            <submit-button-vote class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Threshold">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="threshold_input">Threshold</label>
            <input type="number" id="threshold_input" min="0" max="100" value="50"/>
            <br/><br/>
            <label class="mtb-auto ml-1rem" for="client_input_threshold">Zahl:</label>
            <input type="number" id="client_input_threshold" min="0" max="100" value="77"/><br/>
            <submit-button-threshold class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Sum Threshold">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="threshold_input_sum">Sum Threshold</label>
            <input type="number" id="threshold_input_sum" min="0" max="100" value="50"/>
            <br/><br/>
            <label class="mtb-auto ml-1rem" for="client_input_threshold_sum">Zahl:</label>
            <input type="number" id="client_input_threshold_sum" min="0" max="100" value="77"/><br/>
            <submit-button-sum-threshold class="button-x command-button"/>
          </div>
        </tab-panel>
        <tab-panel val="Standardabweichung">
          <div class="command-div one-liner-box d-flex">
            <label class="mtb-auto" for="client_input_standard_deviation">Wert:</label>
            <input type="number" id="client_input_standard_deviation" min="0" max="100" value="7"/>
            <submit-button-standard-deviation class="button-x command-button"/>
          </div>
        </tab-panel>
      </tab-panels>`
  })
}
