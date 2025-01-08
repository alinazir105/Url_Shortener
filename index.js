require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Url = require('./models/Url');
const nanoid = require('nanoid').nanoid;
const bodyParser = require('body-parser')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const done = (err, data) => {
  if (err) { console.log('Error: ', err) }
  else {
    console.log('Success: ', data)
  }
}
app.post('/api/shorturl', async(req, res)=>{
  const originalUrl = req.body.url
  const shortUrl = nanoid(6)

  const url = new Url({originalUrl: originalUrl, shortUrl: shortUrl})

  try{
    const savedUrl = await url.save()

    res.json({original_url: savedUrl.originalUrl, 
      short_url: savedUrl.shortUrl});
  }
  catch(err){
    res.json({error: 'Failed to save URL.'})
  }
})

app.get('/:shortUrl', async(req, res)=>{

  try{
    const foundUrl = await Url.findOne({shortUrl: req.params.shortUrl})
    if(foundUrl){
      res.redirect(foundUrl.originalUrl)
    }
    else{
      res.json({error: 'URL not found.'})
    }
  }
  catch(err){
    res.json({error: 'Failed to find URL.'})
  }
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
