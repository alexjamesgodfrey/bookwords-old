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
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
function uploadBookDetails(supabase, native_book) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookId = (0, uuid_1.v4)();
        const { data: book, error: bookError } = yield supabase.from("books").insert([
            {
                id: bookId,
                google_id: native_book.googleId,
                title: native_book.title,
                published_date: native_book.publishedDate,
                description: native_book.description,
                pages: native_book.pageCount,
                image: native_book.imageLink,
            },
        ]);
        const authorIds = [];
        for (const author of native_book.authors) {
            // fetch the author by name and create if it doesn't exist
            let { data: authors } = yield supabase
                .from("authors")
                .select("*")
                // Filters
                .eq("name", author);
            if ((authors === null || authors === void 0 ? void 0 : authors.length) === 0) {
                const authorId = (0, uuid_1.v4)();
                const { data, error: authorError } = yield supabase
                    .from("authors")
                    .insert([{ id: authorId, name: author }]);
                authorIds.push(authorId);
            }
            else if (authors !== null) {
                authorIds.push(authors[0].id);
            }
        }
        // create the book_author relationships
        for (const authorId of authorIds) {
            const { data, error: authorError } = yield supabase
                .from("authors_on_book")
                .insert([{ book_id: bookId, author_id: authorId }]);
        }
        return bookId;
    });
}
exports.default = uploadBookDetails;
