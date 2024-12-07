"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJumbleAndHashedAnswer = getJumbleAndHashedAnswer;
exports.hash = hash;
const englishWords_1 = require("./englishWords");
const crypto_1 = __importDefault(require("crypto"));
function getJumbleAndHashedAnswer() {
    let shuffleJumble;
    let valid;
    do {
        const { word, jumble } = shuffle();
        shuffleJumble = jumble;
        valid = validWords(jumble, englishWords_1.englishWords);
        console.log(valid.length);
    } while (valid.length > 20);
    const hashedResults = valid.map(item => hash(item));
    return { jumble: shuffleJumble, hashed_valid: hashedResults.map((word) => Array.from(word)) };
}
function shuffle() {
    const filterArray = englishWords_1.englishWords.filter(item => item.length === 6);
    let randomObj = filterArray[Math.floor(Math.random() * filterArray.length)];
    let wordArray = randomObj.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    console.log(wordArray.join(""));
    return { word: randomObj, jumble: wordArray.join("") };
}
function validWords(jumble, englishWords) {
    // Helper function to count letter frequencies in a word
    function letterCount(word) {
        const count = {};
        for (const c of word) {
            count[c] = (count[c] || 0) + 1;
        }
        return count;
    }
    // Count the letters in the jumble
    const jumbleCount = letterCount(jumble);
    // Collect valid words
    return englishWords.filter((word) => {
        const wordCount = letterCount(word);
        return Object.entries(wordCount).every(([char, count]) => {
            return (jumbleCount[char] || 0) >= count;
        });
    });
}
function hash(input) {
    const hasher = crypto_1.default.createHash("sha256");
    hasher.update(input);
    return hasher.digest();
}
