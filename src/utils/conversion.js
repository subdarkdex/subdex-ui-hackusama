import { assetMap } from '../assets';
import BN from 'bn.js';

const conversion = {
  paramConversion: {
    num: [
      'Compact<Balance>',
      'BalanceOf',
      'u8', 'u16', 'u32', 'u64', 'u128',
      'i8', 'i16', 'i32', 'i64', 'i128'
    ]
  }
};

const convertAmount = (assetId, amount) => {
  if (!amount || isNaN(amount) || Number.parseFloat(amount) < 0) {
    return null;
  }
  const decimals = assetMap.get(assetId).decimals;
  return Math.trunc(Number.parseFloat(amount).toFixed(decimals) * Math.pow(10, decimals));
};

const convertBalance = (assetId, balance) => {
  if (!balance) {
    return null;
  }
  const bn = new BN(balance);
  const decimals = assetMap.get(assetId).decimals;
  const denominator = new BN(10).pow(new BN(decimals));
  return bn.div(denominator);
};

export {conversion as default, convertAmount, convertBalance};
