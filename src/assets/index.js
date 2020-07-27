import ksm from './ksm.png';
import btc from './btc.png';

const assets = [
  {
    assetId: '1',
    symbol: 'KSM',
    logo: ksm,
    name: 'Kusama'
  },

  {
    assetId: '2',
    symbol: 'BTC',
    logo: btc,
    name: 'Bitcoin'
  }
];

const assetMap = new Map(
  assets.map((asset) => [asset.assetId, { ...asset }])
);

export { assets as default, assetMap };
