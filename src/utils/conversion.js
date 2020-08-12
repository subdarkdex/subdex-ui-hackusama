import { assetMap } from '../assets';
import BigNumber from 'bignumber.js';

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
  return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toString();
};

const convertBalance = (assetId, balance) => {
  if (!balance) {
    return null;
  }
  const bn = new BigNumber(balance);
  const decimals = assetMap.get(assetId).decimals;
  const denominator = new BigNumber(10).pow(decimals);
  return bn.div(denominator);
};

const shortenBalance = (balance) => {
  if (balance && balance.length > 9) {
    return balance.substr(0, 9) + '...';
  }
  return balance;
};

const truncDecimals = (asset, amount) => {
  if (amount && amount.indexOf('.') >= 0) {
    const index = amount.indexOf('.');
    const decimals = assetMap.get(asset).decimals;
    let decimalPart = amount.substr(index + 1);
    if (decimalPart.length > decimals) {
      decimalPart = decimalPart.substr(0, decimals);
    }
    return amount.substr(0, index + 1) + decimalPart;
  }
  return amount;
};

export { conversion as default, convertAmount, convertBalance, shortenBalance, truncDecimals };
