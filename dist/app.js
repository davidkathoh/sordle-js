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
const express_1 = __importDefault(require("express"));
const inspector_1 = require("inspector");
const update_program_1 = require("./update_program");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    inspector_1.console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});
// Define a simple route
app.get('/sordle', (req, res) => {
    res.send("hello");
});
app.post("/", (req, res) => {
    const receivedData = req.body;
    // Log the received data to the console
    inspector_1.console.log("Received POST data:", receivedData);
    // Send a response back to the client
    res.json({
        message: "Data received successfully",
        receivedData,
    });
});
app.post("/sordle/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tx = yield (0, update_program_1.setAdmin)();
        res.json({ success: true, tx });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));
// Route to start the game
app.post("/sordle/start-game", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tx = yield (0, update_program_1.startGame)();
        res.json({ success: true, tx });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));
// Route to update the game session
app.post("/sordle/update-game-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const tx = await updateGameSession();
        //res.json({ success: true, tx });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));
// Route to submit a player's answer
app.post("/sordle/play", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { answer } = req.body;
    try {
        const tx = yield (0, update_program_1.play)(answer);
        res.json({ success: true, tx });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));
// Event Listener to listen for game events (startGameEvent)
(0, update_program_1.listen)();
// Start the server
app.listen(PORT, '0.0.0.0', () => {
    inspector_1.console.log(`Server is running on http://localhost:${PORT}`);
});
