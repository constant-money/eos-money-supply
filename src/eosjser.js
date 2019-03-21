import fetch from 'node-fetch';
import { Api, JsonRpc, RpcError } from 'eosjs';
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
  this.account = account;
  this.actor = actor;
  this.transaction = ({ action, data }) => {
    try {
      return api.transact(
        {
          actions: [
            {
              account: this.account,
              name: action,
              authorization: [
                {
                  actor: this.actor,
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
    } catch (e) {
      console.log(`\nCaught exception in ${action}: ` + e);
      if (e instanceof RpcError) return e.json;
    }
  };
}

Eosjser.prototype.transfer = function(from, to, quantity) {
  return this.transaction({
    data: { from, to, quantity },
    action: 'transfer',
  });
};

Eosjser.prototype.purchase = function(to, quantity) {
  return this.transaction({
    data: { to, quantity },
    action: 'purchase',
  });
};

Eosjser.prototype.redeem = function(from, quantity) {
  return this.transaction({
    data: { from, quantity },
    action: 'redeem',
  });
};
