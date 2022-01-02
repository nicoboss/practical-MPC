enum LogType {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    RESULT = "result",
  }
  exports.LogType = LogType
  
  exports.log = function(message: string, logType: LogType) {
    let infoOutput = document.createElement('div');
    infoOutput.classList.add("logger");
    infoOutput.classList.add(logType);
    infoOutput.textContent = message;
    document.getElementById("output")!.appendChild(infoOutput);
    if (logType === LogType.ERROR) {
      (<HTMLDivElement>document.getElementById("log_box")).scrollIntoView();
    }
  }
