import React from 'react'

class WithdrawalFile extends React.Component {
    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.withdrawalFunction(this.addr.value)
            }}>
                <div className="form-group">
                    <label>Address for Withdrawal</label>
                    <input type='text' ref={(input) => this.addr = input}/>
                </div>
                <button type='submit' class="btn btn-primary" role="group">Withdraw Funds</button>
            </form>
        )
    }
}

export default WithdrawalFile