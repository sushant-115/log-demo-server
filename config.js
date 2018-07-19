module.exports = {
  credentials: {
    accessKeyId: "AKIAICW37NEQVZMQL2OQ",
    secretAccessKey: "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"
  },
  options: { //Add the log file path without date and extension
    logfiles: ["/access-log/access-log", "/error-log/error-log", "/security-log/security-log"]
  },
  downloadOptions:
    [{
      folder :"access-log",
      directory: "access-log/access-log",
      date: ["2018619"] //format :"YYYYMDD" <= M=1 to 9 or YYYYMMDD <=  M=10 to 12
    }, {
      folder :"error-log",
      directory: "error-log/error-log",
      date: ["2018619"]
    },{
      folder :"security-log",
      directory: "security-log/security-log",
      date: ["2018618"]
    }]
}

