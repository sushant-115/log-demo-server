module.exports = {
  credentials: {
  },
  options: { //Add the log file path without date and extension
    logfiles: ["/access-log/access-log", "/error-log/error-log", "/security-log/security-log"],
    period: 32 //in days
  },
  downloadOptions: [],
  schedule :"34 * * * * " //schedule format (sec min hour date month year )
}

