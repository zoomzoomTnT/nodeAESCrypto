"use strict";
const crypto = require("crypto");
const eccrypto = require("eccrypto");

let isSigned = false;

const userInfo = function (email) {
    let name = email.split('@', 1),
        password = "0000",
        privateKey = crypto.randomBytes(32),
        hashEmail = crypto.createHash("sha256").update(email).digest(),
        signature = null,
        inbox = [];
    return {
        publicKey: eccrypto.getPublic(privateKey), // Corresponding uncompressed (65-byte) public key.
        login: function(pw, callback){
            if(pw === password) {
                callback({
                    name: name,
                    privateKey: privateKey,
                    hashEmail: hashEmail,
                    inbox: inbox,
                    setSig: function(sig) {
                        signature = sig;
                    },
                    sendEmail: function (to, callback) {
                        callback({
                            content: "email text",
                            hash: hashEmail,
                            sig: signature
                        });
                    }
                });
            } else {
                console.log("log in fail");
            }
        },

        verify: function() {

        },

        sendToInbox: function(emailData) {
            inbox[0] = emailData;
        }


    }

};

function createSig() {
    userA.login("0000", function (data) {
        eccrypto.sign(data.privateKey, data.hashEmail)
            .then(function(sig) {
                console.log("Signature in DER format:", sig);//Authentication
                data.setSig(sig);
            })
            .then (data.sendEmail(userB, function (sigdata) {
                    userB.sendToInbox(sigdata);
                    })
            );


    });
}

function verifySig() {
    userB.login("0000", function (data) {
        eccrypto.verify(userA.publicKey, data.inbox[0].hash, data.inbox[0].sig) //Non- Repudiation
            .then(function() {
                console.log("Signature is OK");
            })
            .catch(function() {
                console.log("Signature is BAD");
            })
    })
}

let userA = userInfo("z.zcong677@gmail.com");
let userB = userInfo("sam@gmail.com");
createSig();

setTimeout(verifySig, 500);






