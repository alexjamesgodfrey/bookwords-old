import dotenv from "dotenv"
import { AlpacaClient, AlpacaStream } from "@master-chief/alpaca";

dotenv.config()

const apikey = process.env.ALPACA_API_KEY;
const secretkey = process.env.ALPACA_SECRET_KEY;

const client = new AlpacaClient({
  credentials: {
    key: apikey!,
    secret: secretkey!,
    paper: true,
  },
});

async function getAccountInformation() {
  const account = await client
    .getAccount()
    .then((account) => console.log(account))
    .catch((err) => console.error(err));
}

getAccountInformation();
