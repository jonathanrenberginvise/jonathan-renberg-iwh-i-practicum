require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE = '2-71553929';
const PROPERTIES = ['name', 'manufacturer', 'nicotine_strength'];

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

// Homepage: list all Snuff records
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=${PROPERTIES.join(',')}&limit=100`;
  try {
    const resp = await axios.get(url, { headers });
    res.render('homepage', {
      title: 'Snuff | Integrating With HubSpot I Practicum',
      records: resp.data.results
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Could not fetch records.');
  }
});

// Form for creating a new record
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// Create a new record from the form data
app.post('/update-cobj', async (req, res) => {
  const newRecord = {
    properties: {
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      nicotine_strength: req.body.nicotine_strength
    }
  };
  try {
    await axios.post(`https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`, newRecord, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Could not create record.');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
