import { Dropdown, Container } from 'semantic-ui-react';
import './token-input.css';

const tokenOptions = [
    {
        key: 'KSM',
        text: 'KSM',
        value: 'Kusama',
        image: { avatar: true, src: '/Kusama1.png' },
    },
    {
        key: 'ETH',
        text: 'ETH',
        value: 'Ethereum',
        image: { avatar: true, src: '/ethereum.jpg' },
    },
]

function TokenInput(props) {
    return (
        <Container className='TokenContainer'>
            <Dropdown
                placeholder='KSM'
                options={tokenOptions}
                className='TokenInput'
            />
        </Container>
    )
}

export default TokenInput 