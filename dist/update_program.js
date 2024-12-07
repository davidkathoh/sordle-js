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
exports.setAdmin = setAdmin;
exports.startGame = startGame;
exports.updateGameSession = updateGameSession;
exports.play = play;
exports.listen = listen;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const sordle_1 = require("./sordle");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const ws_1 = __importDefault(require("ws"));
const connection = new web3_js_1.Connection("https://devnet.helius-rpc.com/?api-key=e30a8b1e-1deb-4f7a-89bf-60b149f39320");
const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(constants_1.admin), { commitment: "confirmed" });
const program = new anchor_1.Program(sordle_1.IDL, provider);
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
        let tx = yield program.methods
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
function startGame() {
    return __awaiter(this, void 0, void 0, function* () {
        const tx = yield program.methods
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
function updateGameSession(nonce, initiator) {
    return __awaiter(this, void 0, void 0, function* () {
        // const gameAccount = await program.account.game.fetch(gamePda);
        // let nonce = gameAccount.nonce;
        const [gameSessionPda] = yield web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("gamesession"),
            initiator.toBuffer(),
            Buffer.from(nonce.toArrayLike(Buffer, "be", 16))
        ], program.programId);
        let { jumble, hashed_valid } = (0, utils_1.getJumbleAndHashedAnswer)();
        console.log("GameSession PDA: ", gameSessionPda.toBase58());
        try {
            const tx = yield program.methods
                .uploadWord({
                jumbleWorld: jumble,
                validWords: hashed_valid
            })
                .accounts({
                signer: constants_1.admin.publicKey,
                // @ts-ignore
                game: constants_1.gamePda,
                gameSession: gameSessionPda,
                config: constants_1.gameConfigPda,
                systemProgram: web3_js_1.SystemProgram.programId,
            })
                .signers([constants_1.admin])
                .rpc({ commitment: "confirmed" });
            console.log("transaction hash: ", tx);
            return tx;
        }
        catch (error) {
            console.log("error uplaodaing");
            console.log(error);
        }
        console.log("Done");
        return " Done";
    });
}
function play(answer) {
    return __awaiter(this, void 0, void 0, function* () {
        const gameAccount = yield program.account.game.fetch(constants_1.gamePda);
        let nonce = gameAccount.nonce;
        console.log("NONCE: ", nonce.toString());
        console.log("Player: ", constants_1.initiator.publicKey.toBase58());
        const [gameSessionPda] = yield web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("gamesession"),
            constants_1.initiator.publicKey.toBuffer(),
            Buffer.from(nonce.toArrayLike(Buffer, "be", 16))
        ], program.programId);
        console.log("GameSession PDA: ", gameSessionPda.toBase58());
        try {
            const tx = yield program.methods
                .play(answer)
                .accounts({
                signer: constants_1.initiator.publicKey,
                // @ts-ignore
                game: constants_1.gamePda,
                gameSession: gameSessionPda,
                config: constants_1.gameConfigPda,
                systemProgram: web3_js_1.SystemProgram.programId,
            })
                .signers([constants_1.initiator])
                .rpc({ commitment: "confirmed" });
            console.log("transaction hash: ", tx);
            return tx;
        }
        catch (error) {
            console.log(error);
        }
    });
}
function listen() {
    return __awaiter(this, void 0, void 0, function* () {
        const eventListener = program.addEventListener("startGameEvent", (event, slot) => __awaiter(this, void 0, void 0, function* () {
            console.log("event called slot: ", slot);
            const currentTime = new Date();
            console.log(`Hello World! Message received at: ${currentTime.toISOString()}`);
            try {
                yield updateGameSession(event.nonce, event.player);
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
