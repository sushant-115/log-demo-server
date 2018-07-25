module.exports = {
  credentials: {
  },
  options: { //Add the log file path without date and extension
    //parentDirectory: __dirname,
    logfiles: ["/home/exotel/exotel-log-demo/access-log/access-log", "/home/exotel/exotel-log-demo/error-log/error-log", "/home/exotel/exotel-log-demo/security-log/security-log"],
    period: 30, //in days
    dateformat: "YYYYMMDD", //default is (YYYYMMDD)
    fileExtension: "txt" 
  },
  previousFileCheckDay :20,
  downloadOptions: [],
  schedule: "59 * * * * " //schedule format (sec min hour date month year )
}

