"use strict";
const crypto = require("crypto");

const EncryptionHelper = (function () {

    function getKeyIVBuffer(alg, key, callback) {
        let keyBuffer = Buffer.from(key);
        let ivBuffer = alg === "aes-256-ecb" ? Buffer.alloc(0) : Buffer.alloc(16); //ECB doesn't utilize an IV
        callback({
            iv: ivBuffer,
            key: keyBuffer
        });
    }

    function encrypt(alg, key, iv, msg, encoding = "base64", msgEnc = 'utf8') {

        let cipher = crypto.createCipheriv(alg, key, iv);
        //cipher.setAutoPadding(true);

        let result = cipher.update(msg, msgEnc, encoding);
        result += cipher.final(encoding);

        return result;
    }

    function decrypt(alg, key, iv, text, encoding = "base64") {

        const decipher = crypto.createDecipheriv(alg, key, iv);

        let result = decipher.update(text, encoding);
        result += decipher.final();

        return result;
    }

    return {
        ALGO: {
            "AES_256_ECB": "aes-256-ecb",
            "AES_256_CTR": "aes-256-ctr",
            "AES_256": "aes256"           //need 32 byte key

        },
        main: getKeyIVBuffer,
        encrypt: encrypt,
        decrypt: decrypt
    };
})();

module.exports = EncryptionHelper;


/*       */

