"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (app) {
    app.get("/test", (req, res) => {
        res.send("analysis");
    });
};
