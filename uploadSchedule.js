const config = require("./config");
const fs = require("fs");
const S3FS = require("s3fs");
const s3fs = new S3FS("exotel-log-server", {
  accessKeyId: config.credentials.accessKeyId,
  secretAccessKey: config.credentials.secretAccessKey
})

const uploadSchedule = () => {
  const time = 1000*60*60*24*30; //milliseconds in 30 days
  const date =new Date(Date.now()-time);
  const fileName = [date.getFullYear(),date.getMonth()+1,date.getDate(),".txt"].join("");
  config.options.logfiles.forEach(file=>{
    const dirName =__dirname+file+fileName;
    const stream = fs.createReadStream(dirName);
    s3fs.writeFile(file+fileName, stream).then((etag) => {
    if (etag){ console.log(etag);
    fs.unlink(dirName, (err) => {
      if (err)
        console.error(err);
      else {
        console.log("done "+file+fileName);
      }
    })
  }
  })

  })
  
}
module.exports =uploadSchedule;