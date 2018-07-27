const fs = require("fs");
const config = require("./config");
const readline = require("readline-sync");
const AWS = require("aws-sdk");
const dateFormat = require("./dateformat");
const Q = require('q');
const PB = require('progress');
let timeout;
AWS.config.update({})
const s3 = new AWS.S3();
class InputFileName {
  constructor(filePath, folder) {
    this.folder = folder;
    this.directory = filePath;
    this.date = []
  }
}

const creatingDateArray = (dt) => {
  const time = 1000 * 60 * 60 * 24 * dt; //milliseconds in 30 days
  const date = dateFormat(new Date(Date.now() - time));
  return [...date, ".", config.options.fileExtension].join("");

}

const choiceLogSelector = (input) => {
  const folder = input.split("/").filter((val, index, arr) => index !== arr.length - 1);
  const filePath = input;
  const downloadFileName = new InputFileName(filePath, folder);
  config.downloadOptions.push(downloadFileName);
}

const downloadAction = () => {
  if (!fs.existsSync("./downloads")) {
    fs.mkdirSync("downloads");
  }
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
      process.exit();
    }
    return Math.floor(day);
  });
  if(dateChoiceArray.length<2||dateChoiceArray>2){
    console.error("\x1b[31m", "Please enter two space seperated dates");
    process.exit();
  }
  if (dateChoiceArray[0] - dateChoiceArray[1] < 0 || dateChoiceArray[0] - dateChoiceArray[1] > 60) {
    console.error("\x1b[31m", "Invalid dates check again");
    process.exit()
  }
  config.downloadOptions.forEach(obj => {
    obj.date = [...Array(+dateChoiceArray[0] - +dateChoiceArray[1] + 1).keys()].map(num => creatingDateArray(num + +dateChoiceArray[1]));
  })
  //console.log(dateChoiceArray, config.downloadOptions);



  if (Array.isArray(config.downloadOptions) && config.downloadOptions.length > 0) {

    const files = [];
    config.downloadOptions.forEach(option => {
      if (Array.isArray(option.date) && option.date.length > 0) {
        option.date.forEach(date => {
          const filePath = "downloads/" + option.directory + date;
          if (!fs.existsSync("downloads/" + option.folder)) {
            fs.mkdirSync("downloads/" + option.folder);
          }
          files.push(filePath);
        })

      }
    })
    files.map(downloadFile);

  }
}

function downloadFile(filename) {
  let deferred = Q.defer(),
    output = filename,
    stream = fs.createWriteStream(output),
    params = {
      Bucket: config.bucket,
      Key: filename
    };
  let bar;
  s3.getObject(params)
    .on('httpHeaders', function (statusCode, headers, resp) {
      let len = parseInt(headers['content-length'], 10);
    })
    .on('httpData', function (chunk) {
      stream.write(chunk);
    })
    .on('httpDone', function (response) {
      if (response.error) {
        deferred.reject(response.error);
      } else {
        deferred.resolve(output);
      }
      stream.end();
    })
    .send();
  return deferred.promise;
}

//module.exports =downloadAction;
downloadAction();
