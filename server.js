import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import { Api, JsonRpc, RpcError } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'util';

const signatureProvider = new JsSignatureProvider([process.env.PRIVATE_KEY]);
const rpc = new JsonRpc(process.env.NODE_ADDRESS, { fetch });
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});
const PORT = 3000;
const app = express();
app.get('/', async (req, res) => {
  try {
    // const resp = await rpc.get_account('tatsukakalot');
    const resp = await api.transact(
      {
        actions: [
          {
            account: 'trongdthdapp',
            name: 'transfer',
            authorization: [
              {
                actor: 'trongdthdapp',
                permission: 'active',
              },
            ],
            data: {
              from: 'trongdthdapp',
              to: 'tatsukakalot',
              quantity: '1 CONST',
              memo: '',
            },
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      },
    );
    res.send(resp);
  } catch (e) {
    console.log('\nCaught exception: ' + e);
    if (e instanceof RpcError) res.send(e.json);
  }
});
app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));
