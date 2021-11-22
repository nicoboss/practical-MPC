var LogType;
(function (LogType) {
    LogType["INFO"] = "info";
    LogType["WARN"] = "warn";
    LogType["ERROR"] = "error";
    LogType["RESULT"] = "result";
})(LogType || (LogType = {}));
exports.LogType = LogType;
exports.log = function (message, logType) {
    var infoOutput = document.createElement('pre');
    infoOutput.className = logType;
    infoOutput.innerHTML = message;
    document.getElementById("output").appendChild(infoOutput);
};
