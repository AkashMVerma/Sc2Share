import React from 'react'

class AccessCar extends React.Component {
    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.enterCar()
            }}>
                <button type='submit' class="btn btn-primary" role="group">Access Car</button>
            </form>
        )
    }
}

export default AccessCar