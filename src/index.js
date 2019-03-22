import 'dotenv/config';
import express from 'express';
import Eosjser from './eosjser';
import bodyParser from 'body-parser';
import { RpcError } from 'eosjs';

const app = express();
app.use(bodyParser.json());
const eosjs = Eosjser({
  private_key: process.env.PRIVATE_KEY,
  node_address: process.env.NODE_ADDRESS,
  account: process.env.ACCOUNT,
  actor: process.env.ACTOR,
});

const tc = async (res, req, method) => {
  try {
    res.send(await eosjs[method](req.body));
  } catch (e) {
    res.send(e instanceof RpcError ? e.json : e);
  }
};

app.post('/transfer', async (req, res) => {
  tc(res, req, 'transfer');
});

app.post('/purchase', async (req, res) => {
  tc(res, req, 'purchase');
});

app.post('/redeem', async (req, res) => {
  tc(res, req, 'redeem');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}!`));
