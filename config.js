module.exports = {
  credentials: {
  },
  options: { //Add the log file path without date and extension
    logfiles: ["/access-log/access-log", "/error-log/error-log", "/security-log/security-log"],
    period: 0, //in days
    dateformat :"DDMMYY", //default is (YYYYMMDD)
    fileExtension :["txt"] //specify for one(that will be for all) or for all
  },
  downloadOptions: [],
  schedule :"59 * * * * " //schedule format (sec min hour date month year )
}

