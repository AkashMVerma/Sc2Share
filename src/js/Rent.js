import React from 'react'
import EthCrypto from 'eth-crypto'

class Rent extends React.Component {


    render() {

        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.beginRent();
            }}>
                <br/>
                <div class="form-group">
                    <button type='submit' class="btn btn-primary">Rent Car</button>
                </div>
            </form>
        )
    }
}

export default Rent