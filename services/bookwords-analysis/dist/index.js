"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors = require("cors");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
require("./routes/analysis")(app);
const port = process.env.PORT;
app.get("/", (req, res) => {
    res.send("Express + TypeScript");
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
