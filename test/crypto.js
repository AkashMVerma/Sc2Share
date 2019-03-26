const EthCrypto = require('eth-crypto');
const ecies = require("eth-ecies");
const ethutil = require("ethereumjs-util");
var Wallet = require('ethereumjs-wallet');
const ownerIdentity = EthCrypto.createIdentity();
const customerIdentity = EthCrypto.createIdentity();
const Web3 = require('web3');
const ganache = require('ganache-core');
var pickUpLocation = "10.32.56.97";
var dropOffLocation = "10.32.56.97";
var carPlateNumber = "DL9C8R2618";
var typeOfCar = "Sedan";

var bookDetails = carPlateNumber.concat(pickUpLocation).concat(typeOfCar);
const web3 = new Web3();
const privateKeyBuffer = EthUtil.toBuffer('0x174ef5719f13918d24ffaaa73b6bd30cd961373ab2c3861d269446a394b65076');
const wallet = Wallet.fromPrivateKey(privateKeyBuffer);

// Get a public key
const pubkey = wallet.getPublicKeyString();

const ganacheProvider = ganache.provider({
    accounts: [
        // we preset the balance of our ownerIdentity to 100 ether
        {
            secretKey: ownerIdentity.privateKey,
            balance: web3.utils.toWei('100', 'ether')
        },
        // we also give some wei to the customerIdentity
        // so it can send transaction to the chain
        {
            secretKey: customerIdentity.privateKey,
            balance: web3.utils.toWei('100', 'ether')
        }
    ]
});

// set ganache to web3 as provider
web3.setProvider(ganacheProvider);


const fs = require('fs');
const solc = require('solc');
let source = fs.readFileSync('SmartContractCrypto.sol', 'utf8');
let compiled = solc.compile(source,1);

const createCode = EthCrypto.txDataByCompiled(compiled.contracts[':SmartContractCrypto'].interface,
                                              compiled.contracts[':SmartContractCrypto'].bytecode, [ownerIdentity.address]);

let abi = compiled.contracts[':SmartContractCrypto'].interface;
const publicKey = customerIdentity.publicKey;
const privateKey = customerIdentity.privateKey.slice(2);

function encrypt(publicKey, data) {
    let userPublicKey = new Buffer(publicKey, 'hex');
    let bufferData = new Buffer(data);

    let encryptedData = ecies.encrypt(userPublicKey, bufferData);

    return encryptedData.toString('hex');
}

function decrypt(privateKey, encryptedData) {
    let userPrivateKey = new Buffer(privateKey, 'hex');
    let bufferEncryptedData = new Buffer(encryptedData, 'hex');
    let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);

    return decryptedData.toString('utf8');
}

//enc consists of the encrypted booking details
var enc = encrypt(publicKey,bookDetails);

//The deploy transaction, value is set to 5 ether so as to deploy the contract successfully.
const deployTx = {
    from:ownerIdentity.address,
    nonce:0,
    gasLimit:5000000,
    gasPrice:500000000,
    value: parseInt(web3.utils.toWei('5','ether')),
    data:createCode
};

//The owner signs the transaction to prove his identity. This signature is also checked on the blockchain.
const serializedTx = EthCrypto.signTransaction(deployTx, ownerIdentity.privateKey);


async function f1(){
    let receipt = await web3.eth.sendSignedTransaction(serializedTx);
    const contractAddress = receipt.contractAddress;
    const contractInstance = new web3.eth.Contract(JSON.parse(compiled.contracts[':SmartContractCrypto'].interface), contractAddress);
    const owner = await contractInstance.methods.carOwner().call();


    const signHash = EthCrypto.hash.keccak256([
        {
            type: 'string',
            value: 'SignedBooking'
        }, {
            type: 'address',
            value: contractAddress
        }, {
            type: 'address',
            value: customerIdentity.address
        }
    ]);


    const detailHash = EthCrypto.hash.keccak256([
        {
            type: 'bytes',
            value: "0x".concat(enc)
        }, {
            type: 'address',
            value: contractAddress
        }, {
            type: 'address',
            value: customerIdentity.address
        },
    ]);



    const signedDetails = EthCrypto.sign(ownerIdentity.privateKey, detailHash);

    const signature = EthCrypto.sign(ownerIdentity.privateKey, signHash);

    const vrs = EthCrypto.vrs.fromString(signature);

    const vrsDetails = EthCrypto.vrs.fromString(signedDetails);

    //transaction for setting the required days
    const requiredDays = contractInstance.methods.setRequiredDays(2).encodeABI();
    const requiredTx = {
        from:customerIdentity.address,
        to:contractAddress,
        nonce:0,
        gasLimit:5000000,
        gasPrice:500000000,
        data: requiredDays,
    }



    const serializedRequiredTx = EthCrypto.signTransaction(requiredTx, customerIdentity.privateKey);
    const receiptRequired = await web3.eth.sendSignedTransaction(serializedRequiredTx);

    //transaction for sending the encrypted details to the blockchain
    var stringToSend = "0x".concat(enc);

    const sendDetails = contractInstance.methods.sendEncryptedDetails(stringToSend).encodeABI();


    const sendDetailsTx = {
        from:ownerIdentity.address,
        to:contractAddress,
        nonce:1,
        gasLimit:5000000,
        gasPrice:500000000,
        data:sendDetails,
    }


    const serializedSendDetailsTx = EthCrypto.signTransaction(sendDetailsTx, ownerIdentity.privateKey);
    const receiptSendDetails = await web3.eth.sendSignedTransaction(serializedSendDetailsTx);

    //retreiving the access token and decrypting it off-chain.
    const accessToken = await contractInstance.methods.accessToken().call();


    const token = accessToken.slice(2);
    messa = decrypt(privateKey,token)

    console.dir(messa);

    //Transaction to call rentCar() function. Requires a value of 5 ether to be executed
    const rentCar = contractInstance.methods.rentCar(customerIdentity.address, vrs.v, vrs.r, vrs.s, vrsDetails.v, vrsDetails.r, vrsDetails.s).encodeABI();


    const rentTx = {
        from:customerIdentity.address,
        to:contractAddress,
        nonce:1,
        gasLimit:5000000,
        gasPrice:500000000,
        data:rentCar,
        value:parseInt(web3.utils.toWei('5','ether'))
    }
    const serializedRecievedTx = EthCrypto.signTransaction(rentTx, customerIdentity.privateKey);

    const receiptRentCar = await web3.eth.sendSignedTransaction(serializedRecievedTx);


    const allowUse = contractInstance.methods.allowCarUsage(ownerIdentity.address).encodeABI();

    const allowUseTx = {
        from:ownerIdentity.address,
        to:contractAddress,
        nonce:2,
        gasLimit:5000000,
        gasPrice:500000000,
        data:allowUse,
    }
    const allowUseTxSerial = EthCrypto.signTransaction(allowUseTx, ownerIdentity.privateKey);

    const receiptAllowUse = await web3.eth.sendSignedTransaction(allowUseTxSerial);


    //transaction to call accessCar() function

    const accessCar = contractInstance.methods.accessCar(customerIdentity.address).encodeABI();

    const accessCarTx = {
        from:customerIdentity.address,
        to:contractAddress,
        nonce:2,
        gasLimit:5000000,
        gasPrice:500000000,
        data:accessCar,
    }

    const accessCarTxSerial = EthCrypto.signTransaction(accessCarTx, customerIdentity.privateKey);

    const receiptAccess = await web3.eth.sendSignedTransaction(accessCarTxSerial);


    //transaction to set extra time if needed.
    // const extraTime = contractInstance.methods.setExtraTimeTaken(1).encodeABI();
    //
    // const extraTimeTx = {
    //     from:customerIdentity.address,
    //     to:contractAddress,
    //     nonce:3,
    //     gasLimit:5000000,
    //     gasPrice:500000000,
    //     data:extraTime,
    // }
    //
    // const serializedExtraTx = EthCrypto.signTransaction(extraTimeTx, customerIdentity.privateKey);

    // const receiptExtraTime = await web3.eth.sendSignedTransaction(serializedExtraTx);

    //transaction to call endRentCar() function
    const endRentCar = contractInstance.methods.endRentCar().encodeABI();

    const endRentTx = {
        from:customerIdentity.address,
        to:contractAddress,
        nonce:3,
        gasLimit:5000000,
        gasPrice:500000000,
        data:endRentCar,
    }

    const serializedendRecievedTx = EthCrypto.signTransaction(endRentTx, customerIdentity.privateKey);

    const receiptEndRent = await web3.eth.sendSignedTransaction(serializedendRecievedTx);


    //transaction to call allowUsage() function



    //transaction to call cancelBooking() function.
     //const cancelUse = contractInstance.methods.cancelBooking(customerIdentity.address).encodeABI();
    //
    // const cancelUseTx = {
    //     from:customerIdentity.address,
    //     to:contractAddress,
    //     nonce:3,
    //     gasLimit:5000000,
    //     gasPrice:500000000,
    //     data:cancelUse,
    // }
    //
    // const cancelUseTxSerial = EthCrypto.signTransaction(cancelUseTx, customerIdentity.privateKey);
    //
    // const receipt4 = await web3.eth.sendSignedTransaction(cancelUseTxSerial);
    //
     const ownerBal = await contractInstance.methods.ownerDeposit().call();
     const ownerEarn = await contractInstance.methods.ownerBalance().call();
    //
     console.dir(ownerBal);
    console.dir(ownerEarn);
    //
     //web3.eth.estimateGas(deployTx, function(error,gas){
         // web3.eth.getGasPrice(function (error, gasPrice){
         //     var gasPrice = Number(gasPrice);
         //     var transactionFee = gasPrice * gas;
         //
         //     console.log(transactionFee);
         // })
         //console.log(gas)
     //});

    // var contractData = contractInstance.new.getData(ownerIdentity.address, {value: parseInt(web3.utils.toWei('5','ether'))}, {data: createCode});
    // var estimate = web3.eth.estimateGas({data: contractData})
    // console.log(estimate)

    // var gasUsedddd = await web3.eth.estimateGas({
    //     "from"      : customerIdentity.address,
    //     "nonce"     : 4,
    //     "to"        : contractAddress,
    //     "data"      : endRentCar
    // });
    //
    // console.log(gasUsedddd);

}
f1();




