import fetch from 'node-fetch';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'util';

export default function Eosjser({ private_key, node_address, account, actor }) {
  if (this instanceof Eosjser === false) {
    return new Eosjser(...arguments);
  }
  const api = new Api({
    rpc: new JsonRpc(node_address, { fetch }),
    signatureProvider: new JsSignatureProvider([private_key]),
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });
  this.transaction = ({ action, data }) => {
    return api.transact(
      {
        actions: [
          {
            account: account,
            name: action,
            authorization: [
              {
                actor: actor,
                permission: 'active',
              },
            ],
            data,
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      },
    );
  };
}

Eosjser.prototype.transfer = function({ from, to, quantity, memo = '' }) {
  return this.transaction({
    data: { from, to, quantity, memo },
    action: 'transfer',
  });
};

Eosjser.prototype.purchase = function({ to, quantity, memo }) {
  return this.transaction({
    data: { to, quantity, memo },
    action: 'purchase',
  });
};

Eosjser.prototype.redeem = function({ from, quantity, memo }) {
  return this.transaction({
    data: { from, quantity, memo },
    action: 'redeem',
  });
};
