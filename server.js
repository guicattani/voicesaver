const cors = require('cors');
const bodyParser = require("body-parser");
const AWS = require('aws-sdk');
const http = require('http');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("express"));// default URL for website
// app.use(cors({ origin: 'http://localhost:3000' , credentials :  true,  methods: 'GET,PUT,POST,OPTIONS', allowedHeaders: 'Content-Type,Authorization' }));

const options = {
  type: ['application/mpeg']
};

app.post('/sendfile', bodyParser.raw(options), function(req,res){
  console.log(req.body)

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const ID = 'AKIAJKZX5BWRB2CMEY4A';
  const SECRET = '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';
  const BUCKET_NAME = 'capsulemaglev-voices';
  const s3 = new AWS.S3({
      accessKeyId: ID,
      secretAccessKey: SECRET
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: req.headers["user-agent"].split(" ")[0] + " "+ Date.now() + 'voice.mp3', // File name you want to save as in S3
    Body: req.body
  };

  s3.upload(params, function(err, data) {
  if (err) {
      throw err;
  }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
});

app.use('/', function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.render('index');
    console.log('served')
});


const server = http.createServer(app);
const port = 3000;
server.listen(process.env.PORT || 5000);console.debug('Server listening on port ' + port);