
/// <reference path="node_modules/@types/node/index.d.ts" />
/// <reference path="node_modules/vue/dist/vue.d.ts" />
/// <reference path="node_modules/aes-ts/dist/index.d.ts" />
/// <reference path="node_modules/sha3/index.d.ts" />

//var parties = 2;
//var JIFFClient = require('./node_modules/jiff-mpc/lib/jiff-client.js');
//var instance = new JIFFClient("http://localhost:8000", "<computation_id>", parties);


//https://v3.vuejs.org/guide/introduction.html
//import Vue = require('vue');
import * as Vue from 'vue';
////import Vue from 'vue';
const Counter = {
  counter: 0,
  data() {
    return {
      counter: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.counter++
    }, 1000)
  } 
}
  
  Vue.createApp(Counter).mount('#counter')

//SHA3-256
import { SHA3 } from 'sha3';
const hash = new SHA3(256);
hash.update('foo');
console.log(hash.digest('hex'));

/*
//node-rsa
const NodeRSA = require('node-rsa');
const rsa_key = new NodeRSA({b: 512});
const rsa_text = 'Hello RSA!';
const rsa_encrypted = rsa_key.encrypt(rsa_text, 'base64');
console.log('encrypted: ', rsa_encrypted);
const rsa_decrypted = rsa_key.decrypt(rsa_encrypted, 'utf8');
console.log('decrypted: ', rsa_decrypted);
*/

//rsa-long
let esaLong = require('rsa-long');
let pubK = "-----BEGIN PUBLIC KEY-----" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxHCeQlKdY7gKEQbKXr5adSesz" +
    "qaVSmmWWne4sgttEU6AB+XndQfO1gLCliVJ/fIgJXxrNpc3pAEWUiEnZZJIuvarN" +
    "vsdU9JENIu9tSqp6zeMS2mzA3NsGLuUB3SZxPA0Q9Zjd6WKeSjoikPfD1FfdC/52" +
    "7aAWvZUCNHn2YMnSFQIDAQAB" +
    "-----END PUBLIC KEY-----"
let priK = "-----BEGIN RSA PRIVATE KEY-----" +
    "MIICXAIBAAKBgQCxHCeQlKdY7gKEQbKXr5adSeszqaVSmmWWne4sgttEU6AB+Xnd" +
    "QfO1gLCliVJ/fIgJXxrNpc3pAEWUiEnZZJIuvarNvsdU9JENIu9tSqp6zeMS2mzA" +
    "3NsGLuUB3SZxPA0Q9Zjd6WKeSjoikPfD1FfdC/527aAWvZUCNHn2YMnSFQIDAQAB" +
    "AoGAEp38BrWpla6HMzHYvRsnAOepQqf9id5S+W8mfyVOOTN1KV/5EGoDXTvm1a/G" +
    "rUIA5sNJhP5905VEuyVMZf6tYvGLHQMws3JYCx+gBotR99/iRkDTbbqXQGfhRFHM" +
    "PXjhEuz9G+Pd4EDuw0BBvHGLT/bIEkhM/RiyF3+muQ1RH80CQQDkTKhS3wbv4CAz" +
    "m14pj4k6M0X7JPf5mN6SDajVLXf90DWqEN8Ur9B7qk+baTtvwqIxSHn8w5ubWWLU" +
    "9BAOQCJvAkEAxpl4nO7byOGgNdqTEvcTjBm0AgmYIdZ2kwF7B+Cfkec+4iRoxuIk" +
    "Zf2zjsVRm417SZjaCHxB1/qViPx0DUOFuwJAE0KoXL12H1ygOtpbulPitudGeyam" +
    "SQdtl5LRcJKycdZUALIFsAAZLaWzq5/YJNidyFyd9gYmpZeH8AFbLWiZvwJAM1x7" +
    "gfKQKrqXSXY2tR/rET+Qezpp+s5RKiGm5NmlywEIFUofQtg3W50qM9E6EsWbTeRW" +
    "9vzTtnya8auAg/GjgwJBAOMVHDtkT2gHUUwOySRf3I3zxM6qItie2l4K/MdCQD10" +
    "O2kX4FBvea1WUyvGEXfZvUIDLrqjMf4MZ3gd51tF42g=" +
    "-----END RSA PRIVATE KEY-----"

let user = {
    id: "7439875489065056595",
    name: "Nico",
    sex: "Male",
    headImg: "https://upload.nico.re/1234.jpg",
    address: "1234"
}

let encryptData = esaLong.encryptLong(pubK, JSON.stringify(user))
console.log(`encryptData：${encryptData}`)

let decData = esaLong.decryptLong(priK, encryptData)
console.log(`decData：${decData}`)

//AES-ECB
import { ECB } from 'aes-ts';
var aes_key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
    29, 30, 31];
var aes_text = [48, 49, 50, 51, 52, 53, 54, 55, 48, 49, 50, 51, 52, 53, 54, 59];
const mode = new ECB(aes_key_256)
const aes_out_text = mode.decrypt(mode.encrypt(aes_text))
console.log(aes_out_text);

//DOM
let message: string = 'Hello, World!';
let heading = document.createElement('h1');
heading.textContent = message;
document.body.appendChild(heading);
