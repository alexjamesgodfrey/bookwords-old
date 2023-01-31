import Alpaca from "@alpacahq/alpaca-trade-api"

const apikey = process.env.ALPACA_API_KEY
const secretkey = process.env.ALPACA_SECRET_KEY

const options = {
  keyId: apikey,
  secretKey: secretkey,
  paper: true, // Set to true to trade on Alpaca's paper trading system
}
const alpaca = new Alpaca(options)

function getAccountInformation() {
  alpaca.getAccount().then((account: Account) => {
    console.log("Current Account:", account)
  })
}

console.log(getAccountInformation())
