"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.gameSessionPda = exports.gamePda = exports.gameConfigPda = exports.signer = exports.initiator = exports.admin = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const sordle_1 = require("./sordle");
exports.admin = web3_js_1.Keypair.fromSecretKey(Uint8Array.from([164, 105, 160, 62, 87, 69, 16, 142, 83, 164, 133, 130, 153, 209, 62, 188, 157, 87, 37, 220, 118, 95, 253, 18, 131, 64, 112, 135, 118, 227, 171, 3, 244, 220, 74, 236, 218, 73, 50, 154, 213, 107, 208, 103, 1, 197, 17, 251, 151, 45, 244, 239, 62, 249, 7, 110, 238, 218, 218, 87, 233, 202, 131, 77]));
exports.initiator = web3_js_1.Keypair.fromSecretKey(Uint8Array.from([164, 105, 160, 62, 87, 69, 16, 142, 83, 164, 133, 130, 153, 209, 62, 188, 157, 87, 37, 220, 118, 95, 253, 18, 131, 64, 112, 135, 118, 227, 171, 3, 244, 220, 74, 236, 218, 73, 50, 154, 213, 107, 208, 103, 1, 197, 17, 251, 151, 45, 244, 239, 62, 249, 7, 110, 238, 218, 218, 87, 233, 202, 131, 77]));
exports.signer = web3_js_1.Keypair.fromSecretKey(Uint8Array.from([164, 105, 160, 62, 87, 69, 16, 142, 83, 164, 133, 130, 153, 209, 62, 188, 157, 87, 37, 220, 118, 95, 253, 18, 131, 64, 112, 135, 118, 227, 171, 3, 244, 220, 74, 236, 218, 73, 50, 154, 213, 107, 208, 103, 1, 197, 17, 251, 151, 45, 244, 239, 62, 249, 7, 110, 238, 218, 218, 87, 233, 202, 131, 77]));
const connection = new web3_js_1.Connection("https://devnet.helius-rpc.com/?api-key=e30a8b1e-1deb-4f7a-89bf-60b149f39320");
const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(exports.admin), { commitment: "confirmed" });
const program = new anchor_1.Program(sordle_1.IDL, provider);
exports.gameConfigPda = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("game_config")], program.programId)[0];
const gamePda = (initiator) => {
    const [gamePda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("game"), initiator.toBuffer()], program.programId);
    return gamePda;
};
exports.gamePda = gamePda;
const gameSessionPda = (nonce, initiator) => {
    const [gameSession] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from("gamesession"),
        initiator.toBuffer(),
        Buffer.from(nonce.toArrayLike(Buffer, "be", 16))
    ], program.programId);
    return gameSession;
};
exports.gameSessionPda = gameSessionPda;
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.delay = delay;
