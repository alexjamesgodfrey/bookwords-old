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
exports.getBookDetails = exports.countCharactersInBook = exports.countWordsInBook = exports.getTextFromBook = exports.shouldParseChapter = exports.countWordsInString = void 0;
const debug_1 = __importDefault(require("debug"));
const entities_1 = require("entities");
// // match all html tags, no matter their contents
const htmlRegex = /(<([^>]+)>)/gi;
const floatingChars = [".", "?", "!", ":", ";", ","];
const cleanText = (text) => {
    // a sentence that ends with a tag followed by a period was leaving an extra space
    let result = (0, entities_1.decodeHTML)(text);
    result = result.replace(/<\/p[^>]*>/g, "~++~");
    result = result
        .replace(htmlRegex, " ") // these are replaced by spaces so that newlines in the text are properly tokenized
        .replace(/“ /g, "“")
        .replace(/ ”/g, "”")
        .replace(/"/g, "") // non-smart quotes complicate spaces and counting words, but don't really matter
        .replace(/\s+/g, " ")
        .trim();
    floatingChars.forEach((c) => {
        result = result.replace(new RegExp(` \\${c}`, "g"), c);
    });
    return result;
};
const getTextForChapter = (book, id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        // using getChapter instead of getChapterRaw. the former of which pulls out style automatically
        try {
            book.getChapter(id, (err, text) => {
                if (err) {
                    (0, debug_1.default)(`failed to parse chapter id: ${id} because of error: ${err}`);
                    // eat the error
                    resolve("");
                    return;
                }
                resolve(cleanText(text));
            });
        }
        catch (err) {
            (0, debug_1.default)(`hard failed to parse chapter id: ${id} because of error: "${err}" in book ${book.metadata.title}`);
            resolve("");
        }
    });
});
/**
 * given a space-separated string, counts the number of words.
 */
const countWordsInString = (text) => {
    return text.split(/\s+/gm).filter((x) => Boolean(x.trim())).length;
};
exports.countWordsInString = countWordsInString;
// TODO: be smarter about this
// id also has info?
const ignoredTitlesRegex = /acknowledgment|copyright|cover|dedication|title|author|contents/i;
const shouldParseChapter = (chapter) => {
    return !Boolean(chapter.title) || !chapter.title.match(ignoredTitlesRegex);
};
exports.shouldParseChapter = shouldParseChapter;
/**
 * given a valid parsed book, returns an array of strings. Each array element is the full text of a chapter.
 */
const getTextFromBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hi");
    return (yield Promise.all(book.flow.map((chapter) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(0, exports.shouldParseChapter)(chapter)) {
            return "";
        }
        return getTextForChapter(book, chapter.id);
    })))).filter(Boolean);
});
exports.getTextFromBook = getTextFromBook;
const getWordCountsForChapters = (chapters) => chapters.reduce((total, chapterText) => (0, exports.countWordsInString)(chapterText) + total, 0);
const getCharacterCountsForChapters = (chapters) => chapters.reduce((total, chapterText) => chapterText.length + total, 0);
const countWordsInBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
    const chapterTexts = yield (0, exports.getTextFromBook)(book);
    return getWordCountsForChapters(chapterTexts);
});
exports.countWordsInBook = countWordsInBook;
const countCharactersInBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
    const chapterTexts = yield (0, exports.getTextFromBook)(book);
    return getCharacterCountsForChapters(chapterTexts);
});
exports.countCharactersInBook = countCharactersInBook;
// this mostly combines the above
const getBookDetails = (book) => __awaiter(void 0, void 0, void 0, function* () {
    const chapterTexts = yield (0, exports.getTextFromBook)(book);
    return {
        text: chapterTexts.join("\n"),
        characterCount: getCharacterCountsForChapters(chapterTexts),
        wordCount: getWordCountsForChapters(chapterTexts),
    };
});
exports.getBookDetails = getBookDetails;
