const config = require("./config");
const fs = require("fs");
const S3FS = require("s3fs");
const schedule = require("node-schedule");
const s3fs = new S3FS("exotel-log-server", {})

const uploadSchedule = () => {
  const time = 1000 * 60 * 60 * 24 * config.options.period; //milliseconds in 30 days
  const date = new Date(Date.now() - time);
  const fileName = [date.getFullYear(), date.getMonth() + 1, date.getDate(), ".txt"].join("");
  config.options.logfiles.forEach(file => {
    const dirName = __dirname + file + fileName;
    if (fs.existsSync(dirName)) {
      const stream = fs.createReadStream(dirName);
      s3fs.writeFile(file + fileName, stream).then((etag) => {
        if (etag) {
          console.log(etag);
          fs.unlink(dirName, (err) => {
            if (err)
              console.error(err);
            else {
              console.log("done " + file + fileName);
            }
          })
        }
      })
    } else {
      console.log("File does not exist" + dirName);
    }
  })

}
//module.exports = uploadSchedule;
schedule.scheduleJob(config.schedule, () => {
  uploadSchedule();
})
console.log("Task scheduled");
