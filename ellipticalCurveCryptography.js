/*ECDSA*/
const crypto = require("crypto");
const eccrypto = require("eccrypto");

const privateKey = crypto.randomBytes(32);
const publicKey = eccrypto.getPublic(privateKey); // Corresponding uncompressed (65-byte) public key.


let str = "zoomzoom digital signature";
let hashStr = crypto.createHash("sha256").update(str).digest();

eccrypto.sign(privateKey, hashStr).then(function(sig) { //sender sign with pk
    console.log("Signature in DER format:", sig);

    eccrypto.verify(publicKey, hashStr, sig) //receiver checksum with the hashed msg
        .then(function() {
            console.log("Signature is OK");
        })
        .catch(function() {
            console.log("Signature is BAD");
        });
});
