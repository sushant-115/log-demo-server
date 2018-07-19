const express = require("express");
const router = express.Router();
const fs = require("fs");
const S3FS = require("s3fs");
const multiparty = require("connect-multiparty");
const config = require("../config");
const s3fs = new S3FS("exotel-log-server", {
  accessKeyId: config.credentials.accessKeyId,
  secretAccessKey: config.credentials.secretAccessKey
})
s3fs.create();
const multipartyMiddleware = multiparty();
router.use(multipartyMiddleware);


router.put("/testupload", (req, res, next) => {
  const file = req.files.file;
  const stream = fs.createReadStream(file.path);
  return s3fs.writeFile("image/" + file.name, stream).then((err) => {
    if (err) console.error(err);
    fs.unlink(file.path, (err) => {
      if (err)
        console.error(err);
      else {
        res.status(200).send("Done")
      }
    })
  })
})

module.exports = router;