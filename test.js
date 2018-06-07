"use strict";
let encryption = require("./nodeAESIvEncryptDecrypt.js");
let assert = require("assert");
let plainText = "This is Zoomzoom";
const Keys = {
    AES_128: "1234567890abcdef",//16
    AES_192: "1234567890abcdefghijklmn",//24
    AES_256: "1234567890abcdefghijklmnopqrstuv"//32
};
let algorithm = encryption.ALGO.AES_256_ECB;
console.log("---testing encryption and decryption---");
console.log("text is: " + plainText);

encryption.main(algorithm, Keys.AES_256, function (data) {

    console.log("Initialized buffers, Algorithm: " + algorithm);

    let enc = encryption.encrypt(algorithm, data.key, data.iv, plainText);
    let dec = encryption.decrypt(algorithm, data.key, data.iv, enc);

    console.log("encrypted text = " + enc);
    console.log("decrypted text = " + dec);
    assert.equal(dec, plainText);
    console.log("---Result: Pass---");
});

plainText = "This is zoomzoom CTR";
    encryption.main(algorithm = encryption.ALGO.AES_256_CTR, Keys.AES_256, function (data) {

    console.log("Initialized buffers, Algorithm: " + algorithm);

    let enc = encryption.encrypt(algorithm, data.key, data.iv, plainText);
    let dec = encryption.decrypt(algorithm, data.key, data.iv, enc);

    console.log("encrypted text = " + enc);
    console.log("decrypted text = " + dec);
    assert.equal(dec, plainText);
    console.log("---Result: Pass---");
});