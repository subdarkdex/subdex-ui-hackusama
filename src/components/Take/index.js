import React, { useState } from 'react';
import Tabs from '../Tabs';
import LabelInput from '../LabelInput';
import { TxButton } from '../TxButton';

export default function Take () {
  const [publicInput, setPublicInput] = useState('');
  const [publicInputError, setPublicInputError] = useState('');

  const [provingKey, setProvingKey] = useState('');
  const [provingKeyError, setProvingKeyError] = useState('');

  const [privateWitness, setPrivateWitness] = useState('');
  const [privateWitnessError, setPrivateWitnessError] = useState('');

  const handleChangePublicInput = (message) => {
    setPublicInput(message);
  };

  const handleChangeProvingKey = (message) => {
    setProvingKey(message);
  };

  const handleChangePrivateWitness = (message) => {
    setPrivateWitness(message);
  };

  return (
    <>
      <Tabs active={'take'} />
      <div className='market-place'>
        <LabelInput
          label='Public input'
          placeholder='Provide the public input.'
          value={publicInput || ''}
          error={publicInputError}
          onChange={e => handleChangePublicInput(e.target.value)}
        />
        <LabelInput
          label='Proving key'
          placeholder='Provide the proving key.'
          value={provingKey || ''}
          error={provingKeyError}
          onChange={e => handleChangeProvingKey(e.target.value)}
        />
        <LabelInput
          label='Private witness'
          placeholder='Provide the private witness.'
          value={privateWitness || ''}
          error={privateWitnessError}
          onChange={e => handleChangePrivateWitness(e.target.value)}
        />
        <TxButton
          disabled={publicInputError || provingKeyError || privateWitnessError}
          attrs={{
            palletRpc: 'dexTakeModule',
            callable: 'withdrawSwappedToken',
            inputParams: [publicInput, provingKey, privateWitness],
            paramFields: [false, false, false]
          }}
          type='SIGNED-TX'
          label='Withdraw'
        />
      </div>
    </>
  );
}
