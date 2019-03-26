import React from 'react'

class EndRent extends React.Component {
    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.endRental()
            }}>
                <button type='submit' class="btn btn-primary" role="group">End Rent</button>
            </form>
        )
    }
}

export default EndRent