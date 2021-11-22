enum LogType {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    RESULT = "result",
  }
  exports.LogType = LogType
  
  exports.log = function(message: string, logType: LogType) {
    let infoOutput = document.createElement('pre');
    infoOutput.className = logType;
    infoOutput.innerHTML = message;
    document.getElementById("output")!.appendChild(infoOutput);
  }
