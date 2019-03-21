import 'dotenv/config';
import express from 'express';
import Eosjser from './eosjser';
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator/check';

const app = express();
app.use(bodyParser.json());
const eosjs = Eosjser({
  private_key: process.env.PRIVATE_KEY,
  node_address: process.env.NODE_ADDRESS,
  account: 'trongdthdapp',
  actor: 'trongdthdapp',
});

app.get('/transfer', async (req, res) => {
  check('');
  const resp = await eosjs.transfer(
    'trongdthdapp',
    'tatsukakalot',
    '0.01 CONST',
  );
  res.send(resp);
});

app.post(
  '/',
  [check('from').exists(), check('to').exists(), check('quantity').exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    res.send({ a: 1 });
  },
);

const PORT = 3000;
app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));
