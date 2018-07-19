const fs = require("fs");
const config = require("./config");
const readline = require("readline-sync");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: config.credentials.accessKeyId,
  secretAccessKey: config.credentials.secretAccessKey
})
const accessLog = {
  folder: "access-log",
  directory: "access-log/access-log",
  date: [] //format :"YYYYMDD" <= M=1 to 9 or YYYYMMDD <=  M=10 to 12
}
const securityLog = {
  folder: "security-log",
  directory: "security-log/security-log",
  date: []
}
const errorLog = {
  folder: "error-log",
  directory: "error-log/error-log",
  date: []
}

const creatingDateArray = (dt) => {
  const time = 1000 * 60 * 60 * 24 * dt; //milliseconds in 30 days
  const date = new Date(Date.now() - time);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate(), ".txt"].join("");

}

const choiceLogSelector = (ch) => {
  if (isNaN(ch)) {
    console.error(ch + " is not a number");
    return
  }
  if (+ch === 1) {
    config.downloadOptions.push(accessLog);
  } else if (+ch === 2) {
    config.downloadOptions.push(securityLog);
  } else if (+ch === 3) {
    config.downloadOptions.push(errorLog);
  } else {
    console.log("invalid input" + ch);
  }
}

const downloadAction = () => {

  const choice = readline.question("Enter space separated number for download that log:\n \n1.  access-log\n2.  security-log\n3.  error-log\n");
  const choiceArray = choice.split(" ").filter(ch => ch);
  choiceArray.forEach(ch => choiceLogSelector(ch));
  const dateChoice = readline.question("Enter log period two Dates(MM/DD/YYYY) space separated (e.g : 05/21/2018 06/14/2018)\n")
  const dateChoiceArray = dateChoice.split(" ").filter(dt => dt).map(dt => {
    const ndt = new Date(dt);
    const time = 1000 * 60 * 60 * 24;
    const day = (new Date() - ndt) / time;
    return Math.floor(day);
  });
  console.log(dateChoiceArray);
  config.downloadOptions.forEach(obj => {
    obj.date = [...Array(+dateChoiceArray[0] - +dateChoiceArray[1] + 1).keys()].map(num => creatingDateArray(num + +dateChoiceArray[1]));
  })
  console.log(dateChoiceArray, config.downloadOptions);


  const options = {
    Bucket: "exotel-log-server",
    Key: ""
  }
  if (Array.isArray(config.downloadOptions) && config.downloadOptions.length > 0) {
    const s3 = new AWS.S3();
    config.downloadOptions.forEach(option => {
      if (Array.isArray(option.date) && option.date.length > 0) {
        option.date.forEach(date => {
          options.Key = option.directory + date + ".txt";
          if (!fs.existsSync("downloads/" + option.folder)) {
            fs.mkdirSync("downloads/" + option.folder);
          }
          console.log(options.Key);
          try {
            const stream = s3.getObject(options).createReadStream().pipe(fs.createWriteStream("downloads/" + options.Key));
          } catch (e) {
            console.log("Nothing found with name" + options.Key);
          }
        })
      }
    })
  }
}

//module.exports =downloadAction;
downloadAction();