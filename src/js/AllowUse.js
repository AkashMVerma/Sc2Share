import React from 'react'

class AllowUse extends React.Component {
    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.allowedUse()
            }}>
                <button type='submit' class="btn btn-primary">Allow Use</button>
            </form>
        )
    }
}

export default AllowUse