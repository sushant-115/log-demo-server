const fs = require("fs");
const config = require("./config");
const readline = require("readline-sync");
const AWS = require("aws-sdk");
const dateFormat = require("./dateformat");
AWS.config.update({})
class InputFileName {
  constructor(filePath ,folder){
  this.folder = folder;
  this.directory = filePath;
  this.date =[]
}
}

const creatingDateArray = (dt) => {
  const time = 1000 * 60 * 60 * 24 * dt; //milliseconds in 30 days
  const date = dateFormat(new Date(Date.now() - time));
  return [...date, ".", config.options.fileExtension].join("");

}

const choiceLogSelector = (input) => {
  const folder = input.split("/").filter((val ,index ,arr)=>index!==arr.length-1);
  const filePath =input;
  const downloadFileName = new InputFileName(filePath ,folder); 
  config.downloadOptions.push(downloadFileName);
}

const downloadAction = () => {

  const choice = readline.question("Enter space separated Exact file Paths\n");
  const choiceArray = choice.split(" ").filter(ch => ch);
  choiceArray.forEach(ch => choiceLogSelector(ch));
  const dateChoice = readline.question("Enter log period two Dates(MM/DD/YYYY) space separated (e.g : 05/21/2018 06/14/2018)\n");
  const dateChoiceArray = dateChoice.split(" ").filter(dt => dt).map(dt => {
    const ndt = new Date(dt);
    if (ndt == "Invalid Date") {
      console.error("\x1b[31m", ndt + " " + dt)
      process.exit()
    }
    const time = 1000 * 60 * 60 * 24;
    const day = (new Date() - ndt) / time;
    if (day > 90) {
      console.error("\x1b[31m", "Invalid dates check again");
    }
    return Math.floor(day);
  });
  if (dateChoiceArray[0] - dateChoiceArray[1] < 0 || dateChoiceArray[0] - dateChoiceArray[1] > 60) {
    console.error("\x1b[31m", "Invalid dates check again");
    process.exit()
  }
  config.downloadOptions.forEach(obj => {
    obj.date = [...Array(+dateChoiceArray[0] - +dateChoiceArray[1] + 1).keys()].map(num => creatingDateArray(num + +dateChoiceArray[1]));
  })
  //console.log(dateChoiceArray, config.downloadOptions);


  const options = {
    Bucket: "exotel-log-server",
    Key: ""
  }
  if (Array.isArray(config.downloadOptions) && config.downloadOptions.length > 0) {
    const s3 = new AWS.S3();
    config.downloadOptions.forEach(option => {
      if (Array.isArray(option.date) && option.date.length > 0) {
        option.date.forEach(date => {
          options.Key = option.directory + date;
          if (!fs.existsSync("downloads/" + option.folder)) {
            fs.mkdirSync("downloads/" + option.folder);
          }
          //console.log(options.Key);
          const stream = s3.getObject(options).createReadStream();
          
          stream.on("error", (err) => {
            console.log("\x1b[31m", "Nothing found with the key", options.Key);
          })
          console.log(stream)
          try{
            stream.pipe(fs.createWriteStream("downloads/" + options.Key))
          }catch(e){
            console.log("Error during wirting file");
          }

        })
      }
    })
  }
}

//module.exports =downloadAction;
downloadAction();
