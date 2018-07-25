const config = require("./config");
const fs = require("fs");
const S3FS = require("s3fs");
const schedule = require("node-schedule");
const s3fs = new S3FS("exotel-log-server", {})
const dateFormat = require("./dateformat")


const uploadSchedule = () => {
  const time = 1000 * 60 * 60 * 24 * config.options.period; //milliseconds in 30 days
  const date = dateFormat(new Date(Date.now() - time));
  const suffix = [ ...date, ".",config.options.fileExtension].join("");
  config.options.logfiles.forEach(file => {
    const filePath = file + suffix;
    if (fs.existsSync(filePath)) {
      const stream = fs.createReadStream(filePath);
      s3fs.writeFile(file + fileName, stream).then((etag) => {
        if (etag) {
          console.log(etag);
          fs.unlink(filePath, (err) => {
            if (err)
              console.error(err);
            else {
              console.log("done " + file + fileName);
            }
          })
        }else{
          console.log("\x1b[31m", "File uploading was unsuccessful");
        }
      }).catch(err=>{
        console.log(err);
      })
    } else {
      console.log("File does not exist" + filePath);
    }
  })

}
//module.exports = uploadSchedule;
schedule.scheduleJob(config.schedule, () => {
  
})
console.log("Task scheduled");
uploadSchedule();