require('dotenv').config();
const eosjs = require('eosjs');
const express = require('express');

const eos = eosjs({
  httpEndpoint: 'http://kylin.fn.eosbixin.com',
  chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
  keyProvider: [process.env.PRIVATE_KEY],
  expireInSeconds: 60,
  sign: true,
});
// eos.getInfo({}).then(res => console.log('res', res));
eos
  .transaction(
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
    // config -- example: {broadcast: false, sign: true}
  )
  .then(res => console.log('res', res))
  .catch(e => console.error('HERE ERROR:', e));

// const options = {
//   authorization: 'trongdthdapp@active',
//   broadcast: true,
//   sign: true,
// };

// const PORT = 3000;
// const app = express();
// app.get('/', async (req, res) => {
//   try {
//     eos.transfer('trongdthdapp', 'tatsukakalot', '1.00 CONST', '', options);
//   } catch (e) {
//     console.log('\nCaught exception: ' + e);
//     if (e instanceof RpcError) res.send(e.json);
//   }
// });
// app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));
