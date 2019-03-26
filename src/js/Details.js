import React from 'react'

class Details extends React.Component {


    render() {

        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.pushDetails('0x'.concat(this.props.encryptedDetails));
            }}>
                <br/>
                <div class="form-group">
                    <button type='submit' class="btn btn-primary">Publish Details</button>
                </div>
            </form>
        )
    }
}

export default Details