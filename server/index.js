const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const members = require('./members.json');

const tempMembers = [...members];

const app = express();

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get('/members', (req, res) => {
  console.log('GET /members');
  res.send(tempMembers);
});

const PORT = 4444;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
