module.exports = {
  credentials: {
  },
  options: { //Add the log file path without date and extension
    logfiles: ["/access-log/access-log", "/error-log/error-log", "/security-log/security-log"],
    period: 0 //in days
  },
  downloadOptions: [],
  schedule :"23 * * * * " //schedule format (sec min hour date month year )
}

