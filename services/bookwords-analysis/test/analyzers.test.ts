import { standardizeFormat, wordCount } from "../src/utils/analyzers"

it("word count of empty array should be 0", () => {
  const result = wordCount([])
  expect(result).toBe(0)
})

it("standardize format standardizes apostrophes", () => {
  expect(standardizeFormat("King’s")).toBe("King's")
})
