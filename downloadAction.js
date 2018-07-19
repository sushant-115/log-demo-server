const fs =require("fs");
const config = require("./config");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: config.credentials.accessKeyId,
  secretAccessKey: config.credentials.secretAccessKey
})

const downloadAction = () => {
  const options = {
    Bucket: "exotel-log-server",
    Key: ""
  }
  if (Array.isArray(config.downloadOptions) && config.downloadOptions.length > 0) {
    const s3 = new AWS.S3();
    config.downloadOptions.forEach(option => {
      if (Array.isArray(option.date) && option.date.length > 0) {
        option.date.forEach(date => {
          options.Key =option.directory+date+".txt";
          if(!fs.existsSync("downloads/"+option.folder)){
            fs.mkdirSync("downloads/"+option.folder);
          }
          console.log(options.Key);
          try{
          const stream = s3.getObject(options).createReadStream().pipe(fs.createWriteStream("downloads/"+options.Key));
          }catch(e){
            console.log("Nothing found with name"+ options.Key);
          }
        })
      }
    })
  }
}
module.exports =downloadAction;