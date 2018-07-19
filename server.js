const express = require("express");
const app = express();
const uploadRouter = require("./routers/uploadRouter");
const multiparty = require("connect-multiparty");
const schedule = require("node-schedule");
const multipartyMiddleware = multiparty();
const uploadSchedule =require("./uploadSchedule");
app.use(multipartyMiddleware);

app.put("/testupload", uploadRouter);

app.listen(8000, (err) => {
  if (err) {
    console.error(err);
  } else {
    schedule.scheduleJob("18 * * * * ", () => {
      uploadSchedule();
    })
    console.log("8000");
  }
})