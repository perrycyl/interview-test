const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const members = require('./members.json');

const tempMembers = [...members];

const app = express();

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use(bodyParser.json());

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
    res.send(filteredMembers);
    return;
  }
  console.log('GET /members');
  res.send(tempMembers);
});

const PORT = 4444;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
