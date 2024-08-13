require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const urlParser = require('url');
const dns = require('dns'); // verify urls

// Basic Configuration
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://jong:'+ process.env['PW'] + '@cluster0.9kfjt.mongodb.net/fcc-urlshortener?retryWrites=true&w=majority&appName=Cluster0');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extendet: true})); //enable to access body

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// POSTING an url
 app.post('/api/shorturl', async (req, res) => {
  // verify url
  const url = req.body.url;
  const dnsLookup = dns.lookup(urlParser.parse(url).hostname, 
  async(err, address) => {
  if(!address){res.json({ error: 'invalid url' })}
  else{
    const shortNumber = await Url.countDocuments({});
    const url = new Url({
      original_url: req.body.url,
      short_url: shortNumber
    })
    const result = await url.save();
    console.log(result);
    res.json(url)
  }
  })                 
});

// GETTING an url
app.get('/api/shorturl/:number', (req, res) => {

  const number = req.params.number;
  Url.findOne({short_url: parseInt(number)}).then(result => {res.redirect(result.original_url)}) ;
              /*
  (err, data) => {
  if(!data){res.json({ error: 'invalid url' })}
  else {res.redirect(data.original_url)}
  })
  */
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// create Schema
let urlSchema = new mongoose.Schema({
  original_url: {type: String, required: true },
  short_url: Number
});

let Url = mongoose.model('Url', urlSchema)
