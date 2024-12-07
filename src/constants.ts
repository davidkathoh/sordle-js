import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { IDL, Sordle } from "./sordle";
import * as anchor from "@coral-xyz/anchor";


export const admin = Keypair.fromSecretKey(Uint8Array.from([164,105,160,62,87,69,16,142,83,164,133,130,153,209,62,188,157,87,37,220,118,95,253,18,131,64,112,135,118,227,171,3,244,220,74,236,218,73,50,154,213,107,208,103,1,197,17,251,151,45,244,239,62,249,7,110,238,218,218,87,233,202,131,77]
));
 export const initiator = Keypair.fromSecretKey(Uint8Array.from([164,105,160,62,87,69,16,142,83,164,133,130,153,209,62,188,157,87,37,220,118,95,253,18,131,64,112,135,118,227,171,3,244,220,74,236,218,73,50,154,213,107,208,103,1,197,17,251,151,45,244,239,62,249,7,110,238,218,218,87,233,202,131,77]
 ));
 export const signer = Keypair.fromSecretKey(Uint8Array.from([164,105,160,62,87,69,16,142,83,164,133,130,153,209,62,188,157,87,37,220,118,95,253,18,131,64,112,135,118,227,171,3,244,220,74,236,218,73,50,154,213,107,208,103,1,197,17,251,151,45,244,239,62,249,7,110,238,218,218,87,233,202,131,77]
 ));



const connection = new Connection("https://devnet.helius-rpc.com/?api-key=e30a8b1e-1deb-4f7a-89bf-60b149f39320");
const provider = new AnchorProvider(connection, new Wallet(admin), { commitment: "confirmed"});
 const program = new Program<Sordle>(IDL as unknown as  Sordle, provider)
 export const [gameConfigPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("game_config")],
    program.programId
  );

 export const [gamePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("game"), initiator.publicKey.toBuffer()],
    program.programId
  );
