"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const alpaca_1 = require("@master-chief/alpaca");
dotenv_1.default.config();
const apikey = process.env.ALPACA_API_KEY;
const secretkey = process.env.ALPACA_SECRET_KEY;
const client = new alpaca_1.AlpacaClient({
    credentials: {
        key: apikey,
        secret: secretkey,
        paper: true,
    },
});
function getAccountInformation() {
    return __awaiter(this, void 0, void 0, function* () {
        const account = yield client
            .getAccount()
            .then((account) => console.log(account))
            .catch((err) => console.error(err));
    });
}
getAccountInformation();
