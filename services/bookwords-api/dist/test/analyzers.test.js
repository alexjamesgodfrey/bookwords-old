"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzers_1 = require("../src/utils/analyzers");
it("word count of empty array should be 0", () => {
    const result = (0, analyzers_1.wordCount)([]);
    expect(result).toBe(0);
});
it("standardize format standardizes apostrophes", () => {
    expect((0, analyzers_1.standardizeFormat)("King’s")).toBe("King's");
});
