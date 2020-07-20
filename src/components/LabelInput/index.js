import styled from 'styled-components'
import React, { useCallback } from 'react'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import './label-input.css';

function useActiveWeb3React() {
    const context = useWeb3ReactCore()
    const contextNetwork = useWeb3ReactCore('NETWORK')
    return context.active ? context : contextNetwork
}

const Input = styled.input`
    font-size: 1.25rem;
    outline: none;
    border: none;
    flex: 1 1 auto;
    width: 0;
    background-color: #7400B8; 
    transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
    color: ${({ error }) => (error ? red : `#9381FF`)};
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    width: 100 %;
    ::placeholder {
        color: #565A69;
    }
    padding: 0px;
    -webkit-appearance: textfield;

    ::-webkit-search-decoration {
        -webkit-appearance: none;
    }

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    ::placeholder {
        color: #565A69;
    }
`;

const ContainerRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1.25rem;
    border: 1px solid ${ ({ error }) => (error ? red : `#9381FF`)};
    transition: 
        border-color 300ms ${ ({ error }) => (error ? 'step-end' : 'step-start')},
        color 500ms ${ ({ error }) => (error ? 'step-end' : 'step-start')};
    background-color: #7400B8;
`;


export default function LabelInput({ value, onChange }) {

    const { chainId } = useActiveWeb3React() //todo
    const { address, loading, name } = useENS(value) //todo

    const handleInput = useCallback(
        event => {
            const input = event.target.value
            const withoutSpaces = input.replace(/\s+/g, '')
            onChange(withoutSpaces)
        },
        [onChange]
    )

    const error = Boolean(value.length > 0 && !loading && !address)

    return (
        <div className="inputPanel">
            <ContainerRow error={error}>
                <div className="inputContainer">
                    <div className="autoColumn">
                        <div className="space">
                            <div className="label">
                                Receiver
                            </div>
                        </div>
                        <Input
                            className="receiver-address-input"
                            type="text"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            placeholder="0x123..."
                            error={error}
                            pattern="^(0x[a-fA-F0-9]{40})$" // ether address format
                            onChange={handleInput}
                            value={value}
                        />
                    </div>
                </div>
            </ContainerRow>
        </div>
    )
}