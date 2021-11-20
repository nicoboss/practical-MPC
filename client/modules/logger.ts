enum LogType {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    RESULT = "result",
  }
  exports.LogType = LogType
  
  exports.log = function(message: string, logType: LogType) {
    let infoOutput = document.createElement('p');
    infoOutput.className = logType;
    infoOutput.textContent = message;
    document.getElementById("output")!.appendChild(infoOutput);
  }
