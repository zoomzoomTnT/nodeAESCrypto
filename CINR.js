"use strict";
const crypto = require("crypto");
const eccrypto = require("eccrypto");


const userInfo = function (email) { //acts like a user account data
    /*private fields*/
    let name = email.split('@', 1),
        password = "0000",
        privateKey = crypto.randomBytes(32),
        hashEmail = crypto.createHash("sha256").update(email).digest(),
        signature = null,
        inbox = [];

    /*public fields and method*/
    return {
        publicKey: eccrypto.getPublic(privateKey), // Corresponding uncompressed (65-byte) public key.

        login: function(pw, callback){ //provide credential to access private fields
            if(pw === password) {
                callback({              //what was private now is visible in callback function
                    name: name,
                    privateKey: privateKey,
                    hashEmail: hashEmail,
                    inbox: inbox,
                    setSig: function(sig) { //enable updating its own signature
                        signature = sig;
                    },
                    sendEmail: function (to, callback) { //Send a digital signature payload containing few information to someone else
                        callback({
                            content: "email context",
                            hash: hashEmail,
                            sig: signature
                        });
                    }
                });
            } else {
                console.log("log in fail"); //no need for fail call back
            }
        },

        sendToInbox: function(emailData) {//set function for inbox arr
            inbox[0] = emailData;
        }
    }

};

function createSig() {// signing process for userA
    /*Log in with password*/
    userA.login("0000", function (data) {
        /*be able to access all private info and sign with private key*/
        eccrypto.sign(data.privateKey, data.hashEmail)
            .then (function(sig) {
                console.log("Signature in DER format:", sig);//Authentication
                data.setSig(sig);
                /*send email and sig to userB*/
                data.sendEmail(userB, function (sigdata) {
                    userB.sendToInbox(sigdata);
                });

            });



    });
}

function verifySig() {// verifying process for userB
    /*Log in with password*/
    userB.login("0000", function (data) {
        /*be able to access all private info and grab inbox emails*/
        eccrypto.verify(userA.publicKey, data.inbox[0].hash, data.inbox[0].sig) //Non- Repudiation
            .then(function() {
                console.log("Signature is OK");
            })
            .catch(function() {
                console.log("Signature is BAD");
            })
    })
}


/*testing*/
let userA = userInfo("z.zcong677@gmail.com");
let userB = userInfo("sam@gmail.com");
createSig();
setTimeout(verifySig, 500);
/*
"C:\Program Files\JetBrains\WebStorm 2018.1.3\bin\runnerw.exe" "C:\Program Files\nodejs\node.exe" C:\Users\zzcon\WebstormProjects\nodeAES\CINR.js
Signature in DER format: <Buffer 30 45 02 21 00 f2 6c f3 81 6d 0a 53 40 17 a0 e3 bb d4 ac 5d 14 28 96 16 88 ae c0 10 1e 92 5d d7 a6 f4 bd 6d 06 02 20 63 09 d9 fe 5b 88 2a e4 b4 aa 80 ... >
Signature is OK

Process finished with exit code 0
* */






