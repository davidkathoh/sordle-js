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
const cors_1 = __importDefault(require("cors"));
const inspector_1 = require("inspector");
const utils_1 = require("./utils");
const update_program_1 = require("./update_program");
const actions_1 = require("@solana/actions");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
const app = (0, express_1.default)();
const PORT = 3000;
const connection = new web3_js_1.Connection("https://devnet.helius-rpc.com/?api-key=e30a8b1e-1deb-4f7a-89bf-60b149f39320");
app.use(express_1.default.json());
//app.use(actionCorsMiddleware())
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
const corsMiddleware = (req, res, next) => {
    Object.entries(actions_1.ACTIONS_CORS_HEADERS).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
};
app.get('/actions.json', (req, res) => {
    const payload = {
        rules: [
            {
                pathPattern: "/sordle",
                apiPath: "/sordle",
            },
        ],
    };
    inspector_1.console.log("actions called");
    // Add the CORS headers and send JSON response
    res.set(actions_1.ACTIONS_CORS_HEADERS)
        .json(payload);
});
// app.options('/actions.json', (req, res) => {
//   console.log("opions")
//   res.set(ACTIONS_CORS_HEADERS)
//      .sendStatus(200);
// });
// Define a simple route
app.get('/sordle', (req, res) => {
    const response = {
        type: "action",
        icon: 'https://storage.googleapis.com/sordle/images/jumble.svg',
        title: 'Sordle',
        description: 'This a word geussing game',
        label: 'start a game',
    };
    res.set(actions_1.ACTIONS_CORS_HEADERS).send(response);
});
app.post("/answer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    process.stdout.write(`📋 Pr: ${JSON.stringify(req.body)}\n`);
    res.send();
}));
app.post("/sordle", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    inspector_1.console.log("post called");
    try {
        const body = req.body;
        let account = new web3_js_1.PublicKey(body.account);
        const transaction = new web3_js_1.Transaction();
        transaction.feePayer = account;
        const recentBlockahs = (yield connection.getLatestBlockhash()).blockhash;
        transaction.recentBlockhash = recentBlockahs;
        let response;
        // try {
        const accountInfo = yield connection.getAccountInfo((0, constants_1.gamePda)(account));
        if (accountInfo === null) {
            // start a game
            transaction.add(yield (0, update_program_1.ixStartGame)(account));
            process.stdout.write(`📋 start: accountInfo ===  null`);
            // transaction.add(await ixUpdateGameSession(0,account))
        }
        else {
            const gameAccount = yield update_program_1.program.account.game.fetch((0, constants_1.gamePda)(account));
            const status = getGameStatus(gameAccount);
            const minutesPass = getMinutesSinceLastUpdate(gameAccount);
            process.stdout.write(`📋 start: ${JSON.stringify(gameAccount)}`);
            if (minutesPass < 3 && status === "INITIATED") {
                process.stdout.write(`📋 start: minutesPass < 3 && status === "INITIATED" \n`);
            }
            else if (minutesPass > 3) {
                //start game
                transaction.add(yield (0, update_program_1.ixStartGame)(account));
                process.stdout.write(`📋 start: minutesPass > 3 \n`);
            }
        }
        response = {
            type: "transaction",
            transaction: (0, utils_1.uint8ArrayToBase64)(transaction.serialize({ requireAllSignatures: false, verifySignatures: false })),
            message: "Game started",
            links: {
                next: {
                    type: "post",
                    href: req.url + "/uploa",
                }
            }
        };
        // } catch (error) {
        //     console.log(error)
        // }
        let respons = {
            type: "action",
            icon: 'https://storage.googleapis.com/sordle/images/ikaiwk.svg',
            title: 'Sordle',
            description: 'This a word geussing game',
            label: 'game started',
            error: { message: "error in the blink" }
        };
        inspector_1.console.log("hrllo cathoh");
        //  res.set(ACTIONS_CORS_HEADERS).send(response)
        res.set(actions_1.ACTIONS_CORS_HEADERS).json(response);
    }
    catch (error) {
        throw error;
    }
    // const userPubkey = receivedData.account;
    // const response = {
    //   transaction: "",
    //   message: `hello ${userPubkey}`,
    // }
    // console.log(response)
    // // Log the received data to the console
    // console.log("Received POST data:", receivedData);
    // Send a response back to the client
    // res.json({
    //   message: "Data received successfully",
    //   receivedData,
    // });
}));
app.post("/sordle/answer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = req.body;
    process.stdout.write(`📋 answer  : ${JSON.stringify(body)}\n`);
    const account = new web3_js_1.PublicKey(body.account);
    let response;
    if ("signature" in req.body) {
        const gameAccount = yield update_program_1.program.account.game.fetch((0, constants_1.gamePda)(account));
        const gameSession = yield update_program_1.program.account.gameSession.fetch((0, constants_1.gameSessionPda)(gameAccount.nonce, account));
        process.stdout.write(`📋 answer  : valid \n`);
        response = {
            type: "action",
            icon: `https://storage.googleapis.com/sordle/images/${gameSession.jumbleWorld}.svg`,
            title: 'Sordle',
            description: 'find a random word for this',
            label: 'game started',
            error: { message: "error in the blink" },
            links: {
                actions: [
                    {
                        label: "submit",
                        href: req.baseUrl + "/sordle/answer",
                        parameters: [
                            {
                                name: "word",
                                label: "Laad"
                            }
                        ],
                        type: 'post'
                    }
                ]
            }
        };
        res.set(actions_1.ACTIONS_CORS_HEADERS).json(response);
    }
    else {
        const word = body.data.word;
        const gameAccount = yield update_program_1.program.account.game.fetch((0, constants_1.gamePda)(account));
        const gameSession = yield update_program_1.program.account.gameSession.fetch((0, constants_1.gameSessionPda)(gameAccount.nonce, account));
        const transaction = new web3_js_1.Transaction();
        transaction.feePayer = account;
        const recentBlockahs = (yield connection.getLatestBlockhash()).blockhash;
        transaction.recentBlockhash = recentBlockahs;
        let tx = yield (0, update_program_1.play)(account, word);
        transaction.add(tx);
        const simulation = yield connection.simulateTransaction(transaction);
        if (simulation.value.err) {
            const customCode = (_b = (_a = JSON.parse(JSON.stringify(simulation.value)).err) === null || _a === void 0 ? void 0 : _a.InstructionError[1]) === null || _b === void 0 ? void 0 : _b.Custom;
            if (customCode == 6006) {
                //game over show score
                res.status(200).json({ error: "Game over " });
            }
            else if (customCode == 6000) {
                // not permitted
                res.status(200).json({ error: "This wallet is not permited " });
            }
            else if (customCode == 6001) {
                res.status(200).json({ error: "Not a valid word, try again" });
            }
            else if (customCode == 6002) {
                // already submitted word
                res.status(200).json({ error: "Already submitted, try another word" });
            }
        }
        else {
            response = {
                type: "transaction",
                transaction: (0, utils_1.uint8ArrayToBase64)(transaction.serialize({ requireAllSignatures: false, verifySignatures: false })),
                message: "Game started",
                links: {
                    next: {
                        type: "post",
                        href: req.baseUrl + "/sordle/answer",
                    }
                }
            };
            res.set(actions_1.ACTIONS_CORS_HEADERS).json(response);
        }
    }
    process.stdout.write(`📋 answer  : ${JSON.stringify(body)}\n`);
}));
app.post("/sordle/uploa", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let account = new web3_js_1.PublicKey(body.account);
    const transaction = new web3_js_1.Transaction();
    transaction.feePayer = account;
    const latestBlockhash = yield connection.getLatestBlockhash();
    let signature = req.body.signature;
    const confirmation = yield connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    }, 'finalized');
    const recentBlockahs = latestBlockhash.blockhash;
    transaction.recentBlockhash = recentBlockahs;
    let response;
    let image;
    try {
        let gameAccount = yield update_program_1.program.account.game.fetch((0, constants_1.gamePda)(account));
        let status = getGameStatus(gameAccount);
        const minutesPass = getMinutesSinceLastUpdate(gameAccount);
        image = yield (0, update_program_1.updateGameSession)(account);
    }
    catch (error) {
        process.stdout.write(`📋 upload: ${error}\n`);
        inspector_1.console.log(error);
    }
    let respons = {
        type: "action",
        icon: `https://storage.googleapis.com/sordle/images/${image}.svg`,
        title: 'Sordle',
        description: 'find a random word for this',
        label: 'game started',
        error: { message: "error in the blink" },
        links: {
            actions: [
                {
                    label: "submit",
                    href: req.baseUrl + "/sordle/answer",
                    parameters: [
                        {
                            name: "word",
                            label: "Laad"
                        }
                    ],
                    type: 'post'
                }
            ]
        }
    };
    inspector_1.console.log("hrllo cathoh");
    //  res.set(ACTIONS_CORS_HEADERS).send(response)
    res.set(actions_1.ACTIONS_CORS_HEADERS).json(respons);
}));
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
        // const tx = await updateGameSession(initiator.publicKey);
        // res.json({ success: true, tx });
    }
    catch (error) {
        inspector_1.console.log(error);
        res.status(500).json({ success: false, error: error.message });
    }
}));
// Route to submit a player's answer
app.post("/sordle/play", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { answer } = req.body;
    try {
        //const tx = await play(answer);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));
// Event Listener to listen for game events (startGameEvent)
//  listen();
// Start the server
app.listen(PORT, '0.0.0.0', () => {
    inspector_1.console.log(`Server is running on http://localhost:${PORT}`);
});
function getGameStatus(gameAccount) {
    return Object.keys(gameAccount.status)[0].toUpperCase();
}
function getMinutesSinceLastUpdate(gameAccount) {
    const lastUpdateTimestamp = Number(gameAccount.lastUpdate);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return Math.floor((currentTimestamp - lastUpdateTimestamp) / 60);
}
// response = {
//   type: "transaction",
//   transaction:uint8ArrayToBase64(transaction.serialize({requireAllSignatures:false, verifySignatures:false})),
//   message:"Game started",
//   links:{
//    next: {
//     type:"inline",
//     action: {
//       type:"action" ,
//    icon: 'https://picsum.photos/200',
//    title: 'Sordle',
//    description: 'This a word geussing game',
//    label: 'started game',
//    error:{message:"error in the blink"},
//    links:{
//     actions:[
//       {
//         type:"post",
//         href:req.url+"action=param?",
//         label:"your word",
//         parameters:[
//           {
//             name:"param",
//             label:"submit",
//             required:true
//           }
//         ]
//       }
