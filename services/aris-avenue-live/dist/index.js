"use strict";
const Alpaca = require("@alpacahq/alpaca-trade-api");
const apikey = "PKQ620PHYK1JQVQ8ATP7";
const secretkey = "ywsCi3KvRmwqQYOjAyJ9SyES7EQBIXfa1arLxxod";
const options = {
    keyId: apikey,
    secretKey: secretkey,
    paper: true, // Set to true to trade on Alpaca's paper trading system
};
const alpaca = new Alpaca(options);
function getAccountInformation() {
    alpaca.getAccount()
        .then((account) => {
        console.log("Current Account:", account);
    });
}
console.log(getAccountInformation());
