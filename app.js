const express = require('express');
const bodyParser = require('body-parser');
const client = require('@mailchimp/mailchimp_marketing');
// const request = require('request');

const port = 5000;
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

client.setConfig({
  apiKey: 'c803b2f212e118c14cea861c70ef237e',
  server: 'us17',
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post('/', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };

  const jsonData = JSON.stringify(data);

  const run = async () => {
    try {
      const response = await client.lists.batchListMembers('0710560761', {
        members: [data],
      });

      res.sendFile(`${__dirname}/success.html`);
    } catch (err) {
      console.log(err.status);
      res.sendFile(`${__dirname}/failure.html`);
    }
  };

  run();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT, () => {
  console.log('Newsletter started successfully');
});

// API Key
// c803b2f212e118c14cea861c70ef237e-us17

// Audience ID/List ID
// 0710560761
