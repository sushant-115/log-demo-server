module.exports = {
  credentials: {
  },
  options: { //Add the log file path without date and extension
    parentDirectory :__dirname,
    logfiles: ["/access-log/access-log", "/error-log/error-log", "/security-log/security-log"],
    period: 39, //in days
    dateformat: "YYYYMMDD", //default is (YYYYMMDD)
    fileExtension: ["txt"] //specify for one(that will be for all) or for all
  },
  downloadOptions: [],
  schedule: "59 * * * * " //schedule format (sec min hour date month year )
}

