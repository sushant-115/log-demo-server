const express = require("express");
const app = express();
const uploadRouter =require("./routers/uploadRouter");
const multiparty = require("connect-multiparty");
const multipartyMiddleware =multiparty();
app.use(multipartyMiddleware);

app.put("/testupload" ,uploadRouter);











app.listen(8000, (err) => {
  if (err) {
    console.error(err);
  }else{
    console.log("8000");
  }
})