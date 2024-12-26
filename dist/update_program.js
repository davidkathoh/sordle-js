"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.program = void 0;
exports.setAdmin = setAdmin;
exports.ixStartGame = ixStartGame;
exports.ixUpdateGameSession = ixUpdateGameSession;
exports.startGame = startGame;
exports.updateGameSession = updateGameSession;
exports.play = play;
exports.listen = listen;
const anchor = __importStar(require("@coral-xyz/anchor"));
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const sordle_1 = require("./sordle");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const ws_1 = __importDefault(require("ws"));
const store_1 = require("./store");
const connection = new web3_js_1.Connection("https://devnet.helius-rpc.com/?api-key=e30a8b1e-1deb-4f7a-89bf-60b149f39320");
const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(constants_1.admin), { commitment: "confirmed" });
exports.program = new anchor_1.Program(sordle_1.IDL, provider);
// Import your IDL and program types
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const tx = yield provider.connection.getBalance(constants_1.admin.publicKey);
        console.log(tx);
        return tx;
    });
}
function setAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        let tx = yield exports.program.methods
            .initialize()
            .accounts({
            admin: constants_1.admin.publicKey,
            // @ts-ignore
            config: constants_1.gameConfigPda,
        }).signers([constants_1.admin])
            .rpc({ commitment: "confirmed" });
        console.log("transaction hash: ", tx);
        return tx;
    });
}
function ixStartGame(initiator) {
    return __awaiter(this, void 0, void 0, function* () {
        // process.stdout.write(`📋 Program ID: ${program.programId.toString()}\n`);
        return yield exports.program.methods
            .startGame()
            .accounts({
            player: initiator,
            // @ts-ignore
            config: constants_1.gameConfigPda,
            game: (0, constants_1.gamePda)(initiator),
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .instruction();
    });
}
function ixUpdateGameSession(nonce, initiator) {
    return __awaiter(this, void 0, void 0, function* () {
        // const gameAccount = await program.account.game.fetch(gamePda);
        // let nonce = gameAccount.nonce;
        let num1 = new anchor.BN(1);
        let value = num1.add(nonce);
        const [gameSessionPda] = yield web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("gamesession"),
            initiator.toBuffer(),
            Buffer.from(nonce.toArrayLike(Buffer, "be", 16))
        ], exports.program.programId);
        let { jumble, hashed_valid } = (0, utils_1.getJumbleAndHashedAnswer)();
        // console.log("GameSession PDA: ", gameSessionPda.toBase58());
        const tx = yield exports.program.methods
            .uploadWord({
            jumbleWorld: jumble,
            validWords: hashed_valid
        })
            .accounts({
            signer: constants_1.admin.publicKey,
            // @ts-ignore
            game: (0, constants_1.gamePda)(initiator),
            gameSession: gameSessionPda,
            config: constants_1.gameConfigPda,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .signers([constants_1.admin])
            .instruction();
        return tx;
    });
}
function startGame() {
    return __awaiter(this, void 0, void 0, function* () {
        const tx = yield exports.program.methods
            .startGame()
            .accounts({
            player: constants_1.initiator.publicKey,
            // @ts-ignore
            config: constants_1.gameConfigPda,
            game: constants_1.gamePda,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .signers([constants_1.initiator])
            .rpc({ commitment: "confirmed" });
        console.log("transaction hash: ", tx);
        return tx;
    });
}
function updateGameSession(account) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, constants_1.delay)(10000);
        const gameAccount = yield exports.program.account.game.fetch((0, constants_1.gamePda)(account));
        let nonce = gameAccount.nonce;
        console.log("Game account upload", JSON.stringify(gameAccount));
        console.log("Game initiator: ", gameAccount.initiator.toBase58());
        console.log("Game nonce", gameAccount.nonce.toString());
        const [gameSession] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("gamesession"),
            gameAccount.initiator.toBuffer(),
            Buffer.from(nonce.toArrayLike(Buffer, "be", 16))
        ], exports.program.programId);
        const game_pda = (0, constants_1.gamePda)(account);
        const game_Account = yield exports.program.account.game.fetch(game_pda);
        const session_pda = (0, constants_1.gameSessionPda)(gameAccount.nonce, account);
        console.log("Game session Pda", gameSession.toBase58());
        let { jumble, hashed_valid } = (0, utils_1.getJumbleAndHashedAnswer)();
        yield store_1.uploader.uploadToGoogleCloud(jumble);
        try {
            const tx = yield exports.program.methods
                .uploadWord({
                jumbleWorld: jumble,
                validWords: hashed_valid
            })
                .accounts({
                signer: constants_1.admin.publicKey,
                // @ts-ignore
                game: game_pda,
                gameSession: session_pda,
                config: constants_1.gameConfigPda,
                systemProgram: web3_js_1.SystemProgram.programId,
            })
                .signers([constants_1.admin])
                .rpc({ commitment: "finalized" });
            console.log("transaction hash: ", tx);
            return jumble;
        }
        catch (error) {
            console.log("error uplaodaing");
            console.log(error);
        }
        console.log("Done");
        return jumble;
    });
}
function play(initiator, answer) {
    return __awaiter(this, void 0, void 0, function* () {
        const gameAccount = yield exports.program.account.game.fetch((0, constants_1.gamePda)(initiator));
        let nonce = gameAccount.nonce;
        const [gameSessionPda] = yield web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("gamesession"),
            initiator.toBuffer(),
            Buffer.from(nonce.toArrayLike(Buffer, "be", 16))
        ], exports.program.programId);
        console.log("nonce play", nonce.toString());
        console.log("GameSession Play PDA: ", gameSessionPda.toBase58());
        console.log("Game status: ", gameAccount.status);
        try {
            const tx = yield exports.program.methods
                .play(answer)
                .accounts({
                signer: initiator,
                // @ts-ignore
                game: (0, constants_1.gamePda)(initiator),
                gameSession: gameSessionPda,
                config: constants_1.gameConfigPda,
                systemProgram: web3_js_1.SystemProgram.programId,
            }).instruction();
            // .signers([initiator])
            // .rpc({commitment:"confirmed"});
            return tx;
        }
        catch (error) {
            console.log(error);
        }
    });
}
function listen() {
    return __awaiter(this, void 0, void 0, function* () {
        const eventListener = exports.program.addEventListener("startGameEvent", (event, slot) => __awaiter(this, void 0, void 0, function* () {
            console.log("event called slot: ", slot);
            const currentTime = new Date();
            console.log(`Hello World! Message received at: ${currentTime.toISOString()}`);
            try {
                //await updateGameSession(event.nonce,event.player)
            }
            catch (error) {
                //res.status(500).json({ success: false, error:  });
                console.log(error.message);
            }
        }));
        console.log("Listener", eventListener);
    });
}
function createHeliusWebSocketListener() {
    const url = `wss://devnet.helius-rpc.com/?api-key=e30a8b1e-1deb-4f7a-89bf-60b149f39320`;
    const ws = new ws_1.default(url);
    ws.on('open', () => {
        console.log('Connected to Helius WebSocket');
        ws.send(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'programSubscribe',
            params: [
                "5eCaxLpmyEFNrqToYJFJzUJqFkZKvoBuRasi2mPa1pdY",
                {
                    "encoding": "jsonParsed"
                }
            ]
        }));
    });
    ws.on('message', (data) => {
        const currentTime = new Date();
        console.log(`Hello World! Message received at: ${currentTime.toISOString()}`);
        console.log(data);
    });
    ws.on('error', (error) => {
        console.error('WebSocket Error:', error);
    });
    ws.on('close', (code, reason) => {
        console.log(`WebSocket closed: ${code} - ${reason}`);
    });
}
