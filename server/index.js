const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const members = require('./members.json');

const tempMembers = [...members];

const app = express();

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use(bodyParser.json());

const randomNumber = Math.floor(10000 + Math.random() * 90000);

/**
 * @params query: string
 */
app.get('/members', (req, res) => {
  const query = req.query.query;
  if (query) {
    const q = query.toLowerCase();
    const filteredMembers = tempMembers.filter(member =>
      member?.name?.toLowerCase()?.includes(q)
    );
    console.log('GET filtered /members');
    res.send(filteredMembers);
    return;
  }
  console.log('GET /members');
  res.send(tempMembers);
});

/**
 * @params name: string required
 * @params age: integer
 * @params activities: array[string]
 * @params rating: enum [1-5]
 */
app.post('/members', (req, res) => {
  console.log('POST /members');
  const body = req.body.body;
  console.log(body)
  if (body) {
    if (!body.name) {
      res.send('Name is required');
      return;
    }
    tempMembers.push({
      id: randomNumber,
      activities: [],
      ...body
    });
  }
  res.send(req.body);
});

const PORT = 4444;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
