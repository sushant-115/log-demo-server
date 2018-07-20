const express = require("express");
const app = express();
const uploadRouter = require("./routers/uploadRouter");
const multiparty = require("connect-multiparty");
const schedule = require("node-schedule");
const fs = require("fs");
const multipartyMiddleware = multiparty();
const uploadSchedule = require("./uploadSchedule");
const downloadAction = require("./downloadAction");
const config = require("./config");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: config.credentials.accessKeyId,
  secretAccessKey: config.credentials.secretAccessKey
})
app.use(multipartyMiddleware);

//app.put("/testupload", uploadRouter);

app.listen(8000, (err) => {
  downloadAction();
  if (err) {
    console.error(err);
  } else {   //schedule format (sec min hour date month year )
    schedule.scheduleJob("53 * * * * ", () => {
      uploadSchedule();
    })
    console.log("8000");
  }
})