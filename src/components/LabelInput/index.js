import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    padding: 8px;

    .label {
        padding: 0;
        margin: 0;
        color: #070020;
        width: 100%;
    }

    > input {
        padding: 8px;
        border: 1px solid;
        border-radius: 20px;
        border-color: #9381ff;
        background-color: transparent;
        width: 100%;
    }
`;

export const LabelInput = (props) => {

    const { label, name, placeholder, error, onValueChange } = props;

    return (
        <Wrapper>
            <p className='label'>
                {label}
            </p>
            <input
                name={name}
                placeholder={placeholder}
                onKeyPress={(e) => onValueChange(e)}
            />
            {error &&
                <p style={{ color: 'red' }}>
                    {error}
                </p>
            }
        </Wrapper>
    )
}

export default LabelInput;