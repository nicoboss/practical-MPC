module.exports = {
  '+': function (v1, v2) {
    console.log(v1 + " + " + v2 + " = " + (v1 + v2));
    return v1 + v2;
  },
  '-': function (v1, v2) {
    console.log(v1 + " - " + v2 + " = " + (v1 - v2));
    return v1 - v2;
  },
  '*': function (v1, v2) {
    console.log(v1 + " * " + v2 + " = " + (v1 * v2));
    return v1 * v2;
  },
  '/': function (v1, v2) {
    console.log(v1 + " / " + v2 + " = " + (v1 / v2));
    return v1 / v2;
  },
  '<': function (v1, v2) {
    console.log(v1 + " < " + v2 + " = " + (v1 < v2));
    return v1 < v2;
  },
  '<=': function (v1, v2) {
    console.log(v1 + " <= " + v2 + " = " + (v1 <= v2));
    return v1 <= v2;
  },
  'floor': function (v) {
    console.log("floor(" + v + ") = " + (Math.floor(v)));
    return Math.floor(v);
  },
  'ceil': function (v) {
    console.log("ceil(" + v + ") = " + (Math.ceil(v)));
    return Math.ceil(v);
  },
  'floor/': function (v1, v2) {
    console.log("Math.floor(" + v1 + " / " + v2 + ") = " + (Math.floor(v1 / v2)));
    return Math.floor(v1 / v2);
  },
  'pow': function (v1, v2) {
    console.log(v1 + " ^ " + v2 + " = " + (Math.pow(v1, v2)));
    return Math.pow(v1, v2);
  },
  'binary': function (v) {
    console.log("binary(" + v + ") = " + (v === 1 || v === 0));
    return v === 1 || v === 0;
  },
  'abs': function (v) {
    console.log("abs(" + v + ") = " + (Math.abs(v)));
    return Math.abs(v);
  },
  '==': function (v1, v2) {
    console.log(v1 + " == " + v2 + " = " + (v1 === v2));
    return v1 === v2;
  },
  'even': function (v1) {
    console.log("even(" + v1 + ") = " + ((v1 % 2) === 0));
    return (v1 % 2) === 0;
  }
};