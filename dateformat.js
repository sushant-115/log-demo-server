const config =require("./config")
const dateFormat = (date) =>{
    switch(config.options.dateformat){
      case "YYYYMMDD" :
      return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      break;
      case "DDMMYYYY" :
      return [date.getDate(), date.getMonth() + 1, date.getFullYear() ]
      break;
      case "DDMMYY":
      return [date.getDate(),date.getMonth() + 1 ,date.getYear()>100?date.getYear()-100:date.getYear()]
      break;
      case "YYMMDD" :
      return [date.getYear()>100?date.getYear()-100:date.getYear(), date.getMonth() + 1, date.getDate()]
      break
      default :
      return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  
    }
  }
  module.exports =dateFormat;