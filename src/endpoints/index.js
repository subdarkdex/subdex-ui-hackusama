import ksm from './ksm.png';
import dark from './dark.png';

const DARK_ENDPOINT_ID = 1;
const KSM_ENDPOINT_ID = 2;

const endpoints = [

  {
    endpointId: DARK_ENDPOINT_ID,
    symbol: 'DARK',
    logo: dark,
    name: 'DarkNet',
    value: 'ws://127.0.0.1:9944'
  },

  {
    endpointId: KSM_ENDPOINT_ID,
    symbol: 'KSM',
    logo: ksm,
    name: 'Kusama',
    value: 'wss://kusama.polkadot.cloud.ava.do'
  }

];

export { endpoints as default };
