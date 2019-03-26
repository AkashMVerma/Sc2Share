import React from 'react'
import Form from './Form'
import Rent from './Rent'
import AllowUse from "./AllowUse";
import AccessCar from "./AccessCar";
import EndRent from "./EndRent";
import WithdrawalFile from "./WithdrawalFile";
import {PaginationLink} from "reactstrap";
import Details from "./Details";

class Content extends React.Component {
    handleSubmit(event){
        event.preventDefault();

        this.props.pushDetails('0x'.concat(this.props.encryptedDetails));
    }

    render() {
        return (
            <form class="form-group">
            <div class="container">
                <div class="row">
                    <div class="col mt-5 pr-auto py-3 px-md-5 border bg-light">
                        <form>
                            <div class="form-group">
                                <strong>Customer's account: {this.props.account}</strong>
                                <hr/>
                                <Form setDays={this.props.setDays}/>
                                <br/>
                                <p>Required Number of Days: {this.props.requiredDays}</p>
                                <hr/>
                                <Rent beginRent = {this.props.beginRent}/>
                                <hr/>
                                <AccessCar enterCar = {this.props.enterCar}/>
                                <hr/>
                                <EndRent endRental = {this.props.endRental}/>
                            </div>
                        </form>
                    </div>
                    <div class="col mt-5 px-auto py-3 px-md-5 border bg-light">
                        <form>
                            <div className="form-group">
                                <strong>Contract Details</strong>
                                <hr/>
                                <p>Contract Address : {this.props.contractAddress}</p>
                                <hr/>
                                <p>Driver Address : {this.props.rentingCustomer}</p>
                                <hr/>
                                <p>Car Usage Allowed: {this.props.allowedUsage}</p>
                                <hr/>
                                <p>Accessible Car: {this.props.accessibleCar}</p>
                                <hr/>
                                <WithdrawalFile withdrawalFunction = {this.props.withdrawalFunction}/>
                            </div>
                        </form>
                    </div>
                    <div class="col py-3 pl-auto mt-5 px-md-5 border bg-light">
                        <strong>Owner's account: {this.props.carOwner}</strong>
                        <hr/>
                        <Details pushDetails = {this.props.pushDetails} encryptedDetails = {this.props.encryptedDetails}/>
                        <hr/>
                        <AllowUse allowedUse = {this.props.allowedUse}/>
                    </div>

            </div>
            </div>
            </form>
        )
    }
}

export default Content