import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route} from "react-router";
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import SmartContractCrypto from '../../build/contracts/SmartContractCrypto.json'
import Content from './Content'
import EciesEth from "eth-ecies";
import EthCrypto from 'eth-crypto'
import Home from "./Home";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.setDays = this.setDays.bind(this);
    this.pushDetails = this.pushDetails.bind(this);
    this.allowedUse = this.allowedUse.bind(this);
    this.enterCar = this.enterCar.bind(this);
    this.beginRent = this.beginRent.bind(this);
    this.setExtraTime = this.setExtraTime.bind(this);
    this.endRental = this.endRental.bind(this);
    this.withdrawalFunction = this.withdrawalFunction.bind(this);
    this.changeState = this.changeState.bind(this);
    this.state = {
        account: '0x0',
        home: true,
        carOwner: '0x0',
        requiredDays: '0',
        rentingCustomer: '0x0',
        loading: true,
        detailsSent: false,
        encryptedDetails : '0',
        contractAddress:'0x',
        allowedUsage: 'No',
        accessibleCar: 'No',
        extraTimeTaken: false,
        rentalEnded : false,
        customer: '0x',
        withdrawalDone : false,
    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.smartCrypto = TruffleContract(SmartContractCrypto)
    this.smartCrypto.setProvider(this.web3Provider)

    //this.watchEvents = this.watchEvents.bind(this)
  }


  componentDidMount() {
    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.smartCrypto.deployed().then((cryptoInstance) => {
        this.cryptoInstance = cryptoInstance
          this.setState({contractAddress : this.smartCrypto.address})
        this.cryptoInstance.carOwner().then((carOwner) => {
            this.setState({carOwner : carOwner})
            this.setState({customer: this.state.account})
          this.setState({loading : false})
        })
      })
    })
  }

  setDays(reqDays) {
           this.cryptoInstance.setRequiredDays(reqDays, {from:this.state.account}).then((result) =>
               this.setState({requiredDays : reqDays})
       )
   }


   pushDetails(encry){
        const pickUpLocation = "10.32.56.97";
        const carPlateNumber = "DL9C8R2618";
        const typeOfCar = "Sedan";
        var bookDetails = carPlateNumber.concat(pickUpLocation).concat(typeOfCar);
        const pubkey = EthCrypto.publicKeyByPrivateKey('0x174ef5719f13918d24ffaaa73b6bd30cd961373ab2c3861d269446a394b65076');
        function encrypt(publicKey, data) {
            let userPublicKey = new Buffer(publicKey, 'hex');
            let bufferData = new Buffer(data);

            let encryptedData = EciesEth.encrypt(userPublicKey, bufferData);

            return encryptedData.toString('hex');
        }

        function decrypt(privateKey, encryptedData) {
            let userPrivateKey = new Buffer(privateKey, 'hex');
            let bufferEncryptedData = new Buffer(encryptedData, 'hex');
            let decryptedData = EciesEth.decrypt(userPrivateKey, bufferEncryptedData);

            return decryptedData.toString('utf8');
        }

        const enc = encrypt(pubkey, bookDetails);
        const dec = decrypt('174ef5719f13918d24ffaaa73b6bd30cd961373ab2c3861d269446a394b65076', enc);

        this.setState({encryptedDetails : '0x'.concat(enc)});
        this.web3.eth.getCoinbase((err, account) => {
            this.setState({ account })
        });
        this.cryptoInstance.sendEncryptedDetails('0x'.concat(this.state.encryptedDetails), {from:'0x11eef84b150196fc27050719cfa1e98fd4026df8'}).then((result)=>
            this.setState({detailsSent : true})
        )
    }


    changeState() {
      this.setState({home:false})
    }
   beginRent(){
       const signHash = EthCrypto.hash.keccak256([
           {
               type: 'string',
               value: 'SignedBooking'
           }, {
               type: 'address',
               value: this.state.contractAddress
           }, {
               type: 'address',
               value: '0xE3c333f0f8eC9A287a863F5584b7851C6363a8D9'

           }
       ]);

       const detailHash = EthCrypto.hash.keccak256([
           {
               type: 'bytes',
               value: this.state.encryptedDetails
           }, {
               type: 'address',
               value: this.state.contractAddress
           }, {
               type: 'address',
               value: '0xE3c333f0f8eC9A287a863F5584b7851C6363a8D9'
           },
       ]);


       const signature = EthCrypto.sign('0xe0b048d926e1a7320a420312d7b153948049e1d1580bd8597efe2701ed64265f', signHash);

       const signedDetails = EthCrypto.sign('0xe0b048d926e1a7320a420312d7b153948049e1d1580bd8597efe2701ed64265f', detailHash);

       this.setState({signature : signature})

       const vrs = EthCrypto.vrs.fromString(signature);

       const vrsDetails = EthCrypto.vrs.fromString(signedDetails);

       this.setState({vrsValue : vrs});
       this.web3.eth.getCoinbase((err, account) => {
           this.setState({ account })
       });

           this.cryptoInstance.rentCar(this.state.account, vrs.v, vrs.r, vrs.s, vrsDetails.v, vrsDetails.r, vrsDetails.s, {from:this.state.account, value: parseInt(this.web3.toWei('5','ether'))}).then((result) =>
                this.setState({rentingCustomer : this.state.account})
      )
   }

    allowedUse(){
        this.web3.eth.getCoinbase((err, account) => {
            this.setState({ account })
        });
        this.cryptoInstance.allowCarUsage(this.state.carOwner, {from: this.state.carOwner}).then((result) =>
            this.setState({allowedUsage : 'Yes'})
        )
    }

    enterCar() {
        this.web3.eth.getCoinbase((err, account) => {
            this.setState({ account })
        });
      this.cryptoInstance.accessCar(this.state.customer, {from: this.state.customer}).then((result) =>
            this.setState({accessibleCar : 'Yes'})
      )

    }

    setExtraTime(xtraTime) {
        this.cryptoInstance.setExtraTimeTaken(xtraTime, {from: this.state.customer}).then((result) =>
            this.setState({extraTimeTaken : true})
        )
    }

    endRental() {
        this.web3.eth.getCoinbase((err, account) => {
            this.setState({ account })
        });
      this.cryptoInstance.endRentCar({from: this.state.account}).then((result) =>
          this.setState({rentalEnded : true})
      )
    }

    withdrawalFunction(addr) {
        this.web3.eth.getCoinbase((err, account) => {
            this.setState({ account })
        });
      this.cryptoInstance.withdrawEarnings(addr, {from: this.state.account}).then((result) =>
          this.setState({withdrawalDone : true})
      )
    }

  render() {
    return (
        <div class='container-fluid' >
    { this.state.home
          ? <Home home={this.state.home}
        changeState = {this.changeState}
        />
  : <Content
    account={this.state.account}
    carOwner = {this.state.carOwner}
    encryptedDetails = {this.state.encryptedDetails}
    setDays = {this.setDays}
    pushDetails = {this.pushDetails}
    rentingCustomer = {this.state.rentingCustomer}
    allowedUse = {this.allowedUse}
    enterCar = {this.enterCar}
    setExtraTime = {this.setExtraTime}
    endRental = {this.endRental}
    extraTimeTaken = {this.state.extraTimeTaken}
    allowedUsage = {this.state.allowedUsage}
    accessibleCar = {this.state.accessibleCar}
    beginRent = {this.beginRent}
    requiredDays = {this.state.requiredDays}
    contractAddress = {this.state.contractAddress}
    withdrawalFunction = {this.withdrawalFunction}
        />
  }
  </div>
  )
  }
}

ReactDOM.render(
<App />,
    document.querySelector('#root')
)

// App = {
//   web3Provider: null,
//   contracts: {},
//   account: '0x0',
//   deployedAddress: '0x0',
//
//   init: function() {
//     return App.initWeb3();
//   },
//
//   initWeb3: function() {
//     if (typeof web3 !== 'undefined') {
//       // If a web3 instance is already provided by Meta Mask.
//       App.web3Provider = web3.currentProvider;
//       web3 = new Web3(web3.currentProvider);
//     } else {
//       // Specify default instance if no web3 instance provided
//       App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
//       web3 = new Web3(App.web3Provider);
//     }
//     return App.initContract();
//   },
//
//   initContract: function() {
//     $.getJSON("SmartContractCrypto.json", function(crypto) {
//       // Instantiate a new truffle contract from the artifact
//       App.contracts.SmartContractCrypto = TruffleContract(crypto);
//       // Connect provider to interact with contract
//       App.contracts.SmartContractCrypto.setProvider(App.web3Provider);
//
//       return App.render();
//     });
//   },
//
//   render: function() {
//     var cryptoInstance;
//     var loader = $("#loader");
//     var content = $("#content");
//     loader.show();
//     content.hide();
//
//     // Load account data
//     web3.eth.getCoinbase(function(err, account) {
//       if (err === null) {
//         App.account = account;
//         $("#accountAddress").html("Your Account: " + account);
//       }
//     });
//
//     // Load contract data
//     App.contracts.SmartContractCrypto.deployed().then(function(instance) {
//       cryptoInstance = instance;
//       App.deployedAddress = cryptoInstance.address;
//       return cryptoInstance.carOwner();
//     }).then(function(carowner) {
//       $("#ownerAddress").html("Owner Account: " + carowner);
//       loader.hide();
//       content.show();
//
//     }).catch(function(error) {
//       console.warn(error);
//     });
//   },
//
//   setDays: function() {
//     var daysSetting = $("#form1");
//     const reqDays = $('#requiredDays').val();
//     App.contracts.SmartContractCrypto.deployed().then(function(con){
//       con.setRequiredDays(reqDays, {from:App.account}).then(function(result){
//         $("#customerDays").html("Duration of Car Rental (days): " + reqDays);
//       })
//     }).catch(function(err){
//       console.log(err);
//     });
//     daysSetting.hide();
//   },
//
//   rentBegin: function() {
//     App.contracts.SmartContractCrypto.deployed().then(function(rent){
//       rent.rentCar(App.account, vrsValue.v, compute.vrsValue.r, compute.vrsValue.s, compute.vrsDetailsValue.v, compute.vrsDetailsValue.r, compute.vrsDetailsValue.s, {from:App.account, value: parseInt(web3.utils.toWei('5','ether'))}).then(function(result){
//         $("#rentingCustomer").html("Car Rented By: " + App.account);
//       })
//     }).catch(function(err){
//       console.log(err);
//     });
//   }
//
//   // showDays: function() {
//   //   ('#loader').show();
//   //   ('#content').hide();
//   //   App.contracts.SmartContractCrypto.deployed().then(function(instance) {
//   //     return instance.driveRequiredEndTime();
//   //   }).then(function(endTime) {
//   //     $("#customerDays").html("Days: " + endTime);
//   //   }).catch(function(error) {
//   //     console.warn(error);
//   //   });
//   //   ('#loader').hide();
//   //   ('#content').show();
//   // }
// };
//
// $(function() {
//   $(window).load(function() {
//     App.init();
//   });
// });