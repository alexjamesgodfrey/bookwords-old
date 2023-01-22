"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterAnalysis = exports.wordsToOccurencesComplex = exports.wordsToOccurencesSimple = exports.isEnglishWord = exports.specificCount = exports.charactersWithoutSpaces = exports.charactersWithSpaces = exports.wordCount = void 0;
const Words_1 = require("../types/Words");
const processors_1 = require("./processors");
const isWord = require("is-word");
function wordCount(text) {
    return text.length;
}
exports.wordCount = wordCount;
function charactersWithSpaces(text) {
    return text.join("").length;
}
exports.charactersWithSpaces = charactersWithSpaces;
function charactersWithoutSpaces(text) {
    return text.join("").replace(/ /g, "").length;
}
exports.charactersWithoutSpaces = charactersWithoutSpaces;
function specificCount(word, text) {
    return text.reduce((prev, curr) => (curr === word ? prev + 1 : prev), 0);
}
exports.specificCount = specificCount;
function isEnglishWord(tester, word) {
    const lword = word.toLocaleLowerCase();
    if (word.length === 1)
        return lword === "i" || lword === "a";
    return tester.check(lword);
}
exports.isEnglishWord = isEnglishWord;
function wordsToOccurencesSimple(text) {
    const wordMap = new Map();
    text.forEach((word) => {
        const naked = (0, processors_1.removePunctuation)(word.toLocaleLowerCase());
        if (naked === "")
            return; // ignore empty strings
        if (wordMap.has(naked)) {
            wordMap.set(naked, wordMap.get(naked) + 1);
        }
        else {
            wordMap.set(naked, 1);
        }
    });
    return wordMap;
}
exports.wordsToOccurencesSimple = wordsToOccurencesSimple;
function wordsToOccurencesComplex(labeledWords) {
    const wordMap = new Map();
    labeledWords.forEach((word) => {
        const wordString = JSON.stringify(word);
        if (wordMap.has(wordString)) {
            wordMap.set(wordString, wordMap.get(wordString) + 1);
        }
        else {
            wordMap.set(wordString, 1);
        }
    });
    return wordMap;
}
exports.wordsToOccurencesComplex = wordsToOccurencesComplex;
function labelText(text) {
    const tester = isWord("american-english");
    const mega = text.join(" ");
    const words = mega.split(" ");
    const labeledWords = [];
    let previous = "";
    let ignoreCount = 0;
    words.forEach((word, index, array) => {
        if (ignoreCount > 0) {
            ignoreCount--;
            return;
        }
        let realWord = (0, processors_1.standardizeFormat)(word);
        let type;
        if ((0, processors_1.isProperNoun)(previous, realWord)) {
            while (array[index + 1] &&
                ((0, processors_1.isProperNoun)(realWord, array[index + 1]) ||
                    (0, processors_1.isNotCapitalizedInTitle)(realWord, array[index + 1]))) {
                if (realWord.split(" ").length === 1 && array[index + 1] === "and")
                    break;
                realWord += " " + array[index + 1];
                previous = array[index + 1];
                ignoreCount++;
                index++;
                // stop if there is a comma or and in the middle of our proper phrase
                if ((realWord.endsWith(",") || realWord.endsWith("~++~")) &&
                    (0, processors_1.isProperNoun)(previous, array[index + 1])) {
                    break;
                }
            }
            // check if proper phrase ends with something that shouldnt be in it
            realWord = (0, processors_1.removePunctuationExceptApostrophes)(realWord);
            const properArr = realWord.split(" ");
            const lastWord = properArr.pop() || "";
            if ((0, processors_1.isNotCapitalizedInTitle)("", lastWord)) {
                realWord = realWord.replace(new RegExp(lastWord + "$"), ""); // replaces last occurrence
                ignoreCount--;
            }
            realWord = realWord.trim();
            type =
                properArr.length > 1 ? Words_1.WordType.PROPER_PHRASE : Words_1.WordType.PROPER_NOUN;
        }
        else if (tester.check((0, processors_1.removePunctuationExceptApostrophes)(word.toLocaleLowerCase()))) {
            type = Words_1.WordType.WORD;
            realWord = (0, processors_1.removePunctuationExceptApostrophes)(realWord.toLocaleLowerCase());
            previous = word;
        }
        else {
            type = Words_1.WordType.INVENTED;
            realWord = (0, processors_1.removePunctuationExceptApostrophes)(realWord);
            previous = word;
        }
        if (realWord.length > 0) {
            labeledWords.push({
                word: realWord,
                type,
            });
        }
    });
    return labeledWords;
}
function masterAnalysis(text) {
    const asString = text.join(" ");
    const unlabeledWords = asString
        .split(" ")
        .map((w) => (0, processors_1.removePunctuationExceptApostrophes)(w.trim()));
    const labeledWords = labelText(text);
    const wordCount = labeledWords.reduce((prev, curr) => {
        if (curr.type === Words_1.WordType.PROPER_PHRASE) {
            return prev + curr.word.split(" ").length;
        }
        return prev + 1;
    }, 0);
    const charactersIncludingSpaces = asString.length;
    const charactersExcludingSpaces = unlabeledWords.join("").length;
    const sentences = asString.split(/[.?!]/g).filter((s) => s.length > 0);
    const paragraphs = asString.split(/[~++~]/g).filter((p) => p.length > 0);
    const uniqueWordCount = new Set(unlabeledWords).size;
    const wordsLessThanFive = unlabeledWords.filter((w) => w.length < 5);
    const averageWordLength = charactersExcludingSpaces / wordCount;
    const averageSentenceLength = wordCount / sentences.length;
    const averageParagraphLength = wordCount / paragraphs.length;
    const longestString = unlabeledWords.reduce((prev, curr) => (curr.length > prev.length ? curr : prev), "");
    // const occurrences = wordsToOccurencesComplex(labeledWords)
    const occurences = wordsToOccurencesSimple(unlabeledWords);
    const ret = {
        totalWords: wordCount,
        charactersIncludingSpaces: charactersIncludingSpaces,
        charactersExcludingSpaces: charactersExcludingSpaces,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        uniqueWords: uniqueWordCount,
        wordsLessThanFive: wordsLessThanFive.length,
        averageWordLength: averageWordLength,
        averageSentenceLength: averageSentenceLength,
        averageParagraphLength: averageParagraphLength,
        longestWord: longestString,
        top100WordsCommon: Array.from(occurences)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 100),
        top100WordsWithoutCommon: (0, processors_1.removeCommonWords)(Array.from(occurences))
            .sort((a, b) => b[1] - a[1])
            .slice(0, 100),
        // top100WordsCommon: Array.from(occurrences)
        //   .sort((a, b) => b[1] - a[1])
        //   .slice(0, 100),
        // top100WordsWithoutCommon: removeCommonWords(Array.from(occurrences))
        //   .sort((a, b) => b[1] - a[1])
        //   .slice(0, 100),
    };
    console.log(ret);
    return ret;
}
exports.masterAnalysis = masterAnalysis;
