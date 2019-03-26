 const EthCrypto = require('eth-crypto');
 const ecies = require("eth-ecies");
 const EthUtil = require("ethereumjs-util");
const pickUpLocation = "10.32.56.97";
const dropOffLocation = "10.32.56.97";
const carPlateNumber = "DL9C8R2618";
const typeOfCar = "Sedan";
var bookDetails = carPlateNumber.concat(pickUpLocation).concat(typeOfCar);

const pubkey = EthCrypto.publicKeyByPrivateKey('174ef5719f13918d24ffaaa73b6bd30cd961373ab2c3861d269446a394b65076');

console.log(pubkey);


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

const enc = encrypt(pubkey, bookDetails);
const dec = decrypt('174ef5719f13918d24ffaaa73b6bd30cd961373ab2c3861d269446a394b65076', enc);
console.log(enc);

// EthCrypto.encryptWithPublicKey(pubkey, bookDetails).then(function (result) {
//     enc = EthCrypto.cipher.stringify(result);
//     console.log(enc);
// }).catch(function (err) {
//     console.log(err);
// });
//
// const parsedEncryption = EthCrypto.cipher.parse(enc);
//
// EthCrypto.decryptWithPrivateKey('0x174ef5719f13918d24ffaaa73b6bd30cd961373ab2c3861d269446a394b65076', parsedEncryption).then(function(result){
//     dec = result;
//     console.log(dec);
// }).catch(function (err) {
//     console.log(err);
// });

const signHash = EthCrypto.hash.keccak256([
    {
        type: 'string',
        value: 'SignedBooking'
    }, {
        type: 'address',
        value: '0x5170A04fa9B1CA6654027Eb25C1cFFD212b816B1'
    }, {
        type: 'address',
        value: '0xE3c333f0f8eC9A287a863F5584b7851C6363a8D9'

    }
]);

const detailHash = EthCrypto.hash.keccak256([
    {
        type: 'bytes',
        value: "0x".concat('c69d377c29b70221dd041954c1c4010504e56161f905f646e0cc2f9d80dcdbf034dd84c22abe2714eebf31323c80aba7e8c002521582fc82dd7f0278942b91bb328664514f068e1894ebe5352d47c8f1ed283c728ad14ba127444c5f567aa39a577a9ace7bc5b93c4a990f57aba3eb9a0e1308db3b0c0dc23adba1353ba1a6a20daf4604c5c80223a2851278697d127f5d')
    }, {
        type: 'address',
        value: '0x5170A04fa9B1CA6654027Eb25C1cFFD212b816B1'
    }, {
        type: 'address',
        value: '0xE3c333f0f8eC9A287a863F5584b7851C6363a8D9'
    },
]);


const signedDetails = EthCrypto.sign('0xe0b048d926e1a7320a420312d7b153948049e1d1580bd8597efe2701ed64265f', detailHash);

const signature = EthCrypto.sign('0xe0b048d926e1a7320a420312d7b153948049e1d1580bd8597efe2701ed64265f', signHash);

const vrs = EthCrypto.vrs.fromString(signature);

const vrsDetails = EthCrypto.vrs.fromString(signedDetails);

 const publkey = EthCrypto.publicKeyByPrivateKey('0x174ef5719f13918d24ffaaa73b6bd30cd961373ab2c3861d269446a394b65076');
 const addressEvaulated = EthCrypto.publicKey.toAddress(publkey);
 console.log(addressEvaulated)
//console.log(vrs);
 //console.log(vrsDetails);
