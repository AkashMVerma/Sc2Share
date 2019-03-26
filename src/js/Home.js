import React from 'react'


class Home extends React.Component {
    render() {
        return (
            <form class="form-group my-auto">
                <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
                    <h5 class="my-0 mr-md-auto font-weight-normal"> Sc2Share </h5>
                </div>
                <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
                    <h1 class="display-4">Need a Car?</h1>
                    <p class="lead">
                        Welcome to the new decentralized world of personal car sharing. Use Sc2Share to see a catalogue of several available personal cars in your area and find a suitable match for your needs.
                    </p>
                </div>
                <div class="container">
                    <div class="card">
                        <img src="../images/polo_wv.jpg" class="card-img-top"/>
                        <div class="card-body">
                            <h5 class="card-title">VW Polo</h5>
                            <p class="card-text">Available in Prague, Deposit = 5 ETH</p>
                            <button className="btn btn-primary" onSubmit={"http://localhost:8080/"} onClick={this.handleSubmit.bind(this)}>Book</button>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="card">
                        <img src="../images/astra.jpg" className="card-img-top"/>
                        <div className="card-body">
                            <h5 className="card-title">Opel Astra</h5>
                            <p className="card-text">Available in Prague, Deposit = 5.5 ETH</p>
                            <button className="btn btn-primary" onSubmit={"http://localhost:8080/"}
                                    onClick={this.handleSubmit.bind(this)}>Book
                            </button>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="card">
                        <img src="../images/citroen-c2-phase-ii-2008.jpg" className="card-img-top"/>
                        <div className="card-body">
                            <h5 className="card-title">Citroen C2</h5>
                            <p className="card-text">Available in Prague, Deposit = 3 ETH</p>
                            <button className="btn btn-primary" onSubmit={"http://localhost:8080/"}
                                    onClick={this.handleSubmit.bind(this)}>Book
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    handleSubmit(event){
        event.preventDefault();
       this.props.changeState();
    }
}

export default Home