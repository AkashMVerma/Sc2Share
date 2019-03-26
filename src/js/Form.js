import React from 'react'

class from extends React.Component {
    render() {
        return (
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.setDays(this.numberDays.value)
            }}>
                <div class="form-group">
                    <label>Set Required Days</label>
                    <input type='text' ref={(input) => this.numberDays = input}/>
                </div>
                <button type='submit' class="btn btn-primary" role="group">Set Required Days</button>
            </form>
        )
    }
}

export default from