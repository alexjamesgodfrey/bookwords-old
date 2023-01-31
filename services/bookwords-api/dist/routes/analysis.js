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
const epub2_1 = __importDefault(require("epub2"));
const uuid_1 = require("uuid");
const analyzers_1 = require("../utils/analyzers");
const supabase_1 = __importDefault(require("../utils/supabase"));
const textHandlers_1 = require("../utils/textHandlers");
const uploadBookDetails_1 = __importDefault(require("../utils/uploadBookDetails"));
const fs = require("fs");
const path = require("path");
module.exports = function (app) {
    app.get("/analysis", (req, res) => {
        res.send("analysis");
    });
    app.post("/analysis/request", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { user_id, file_id, native_book } = req.body;
        console.log(native_book);
        let { data: books } = yield supabase_1.default
            .from("books")
            .select("*")
            // Filters
            .eq("google_id", native_book.googleId);
        console.log(books);
        // create the book if there isn't one
        const bookId = (books && books[0] && books[0].id) ||
            (yield (0, uploadBookDetails_1.default)(supabase_1.default, native_book));
        // download the file
        const { data, error } = yield supabase_1.default.storage
            .from("books")
            .download(file_id);
        // save the file locally and analyze it
        if (data) {
            const abuf = yield data.arrayBuffer();
            const buf = Buffer.from(abuf);
            const filePath = "epubs/" + (0, uuid_1.v4)() + ".epub";
            fs.writeFile(filePath, buf, {
                encoding: "utf8",
            }, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    console.log(err);
                yield epub2_1.default.createAsync(filePath)
                    .then((epub) => __awaiter(this, void 0, void 0, function* () {
                    const text = yield (0, textHandlers_1.getTextFromBook)(epub);
                    const result = (0, analyzers_1.masterAnalysis)(text);
                    const contributionId = (0, uuid_1.v4)();
                    // upload the analysis
                    const { data, error } = yield supabase_1.default
                        .from("contributions")
                        .insert([
                        {
                            id: contributionId,
                            by: user_id,
                            google_id: native_book.googleId,
                            book_id: bookId,
                            words: result.totalWords,
                            characters_including_spaces: result.charactersIncludingSpaces,
                            characters_excluding_spaces: result.charactersExcludingSpaces,
                            sentences: result.sentences,
                            paragraphs: result.paragraphs,
                            unique_words: result.uniqueWords,
                            short_words: result.wordsLessThanFive,
                            average_word: result.averageWordLength,
                            average_sentence: result.averageSentenceLength,
                            average_paragraph: result.averageParagraphLength,
                            longest_word: result.longestWord,
                        },
                    ]);
                    // upload top 100 words common
                    const { data: top100WordsCommon, error: error2 } = yield supabase_1.default
                        .from("tops_on_contribution")
                        .insert(result.top100WordsCommon.map((top, index) => ({
                        contribution_id: contributionId,
                        is_common: true,
                        word: top[0],
                        rank: index + 1,
                        count: top[1],
                    })));
                    // upload top 100 words uncommon
                    const { data: top100WordsUncommon, error: error3 } = yield supabase_1.default.from("tops_on_contribution").insert(result.top100WordsWithoutCommon.map((top, index) => ({
                        contribution_id: contributionId,
                        is_common: false,
                        word: top[0],
                        rank: index + 1,
                        count: top[1],
                    })));
                }))
                    .catch((err) => {
                    console.log("ERROR\n-----");
                    console.log(err);
                    throw err;
                });
            }));
        }
        res.send("analysis request");
    }));
};
