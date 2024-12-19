import * as anchor from "@coral-xyz/anchor";
import { Address, AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import crypto from "crypto";
import { IDL, Sordle } from "./sordle";
import { admin, gameConfigPda, gamePda, initiator } from "./constants";
import { getJumbleAndHashedAnswer } from "./utils";
import WebSocket from 'ws';



 const connection = new Connection("https://devnet.helius-rpc.com/?api-key=e30a8b1e-1deb-4f7a-89bf-60b149f39320");
const provider = new AnchorProvider(connection, new Wallet(admin), { commitment: "confirmed"});
export const program = new Program<Sordle>(IDL as unknown as  Sordle, provider)

// Import your IDL and program types

async function setup() {
   
  const tx = await provider.connection.getBalance(admin.publicKey);
  console.log(tx)
  return tx
  
}



export async function setAdmin() {
    
    let tx = await  program.methods
    .initialize()
    .accounts({
        admin:admin.publicKey,
        // @ts-ignore
        config:gameConfigPda, 
    }).signers([admin])
    .rpc({commitment:"confirmed"});

    console.log("transaction hash: ",tx)
    return tx
}

export async function ixStartGame(initiator:PublicKey){
 // process.stdout.write(`📋 Program ID: ${program.programId.toString()}\n`);
 
  return await program.methods
  .startGame()
  .accounts({
    player: initiator,
    // @ts-ignore
    config: gameConfigPda,
    game: gamePda(initiator),
    systemProgram: SystemProgram.programId,
  })
  .instruction()
}

export async function ixUpdateGameSession(nonce,initiator:PublicKey){
  // const gameAccount = await program.account.game.fetch(gamePda);
  // let nonce = gameAccount.nonce;
  let num1:anchor.BN = new anchor.BN(1);

  let value = num1.add(nonce)
  
  
   const  [gameSessionPda] = await PublicKey.findProgramAddressSync(
       [
         Buffer.from("gamesession"), 
         initiator.toBuffer(), 
         Buffer.from(nonce.toArrayLike(Buffer,"be", 16))
       ],
       program.programId
     );

     
     
   let {jumble,hashed_valid} = getJumbleAndHashedAnswer()
  
  // console.log("GameSession PDA: ", gameSessionPda.toBase58());

 

       const tx = await program.methods
       .uploadWord({
         jumbleWorld:jumble,
         validWords:hashed_valid
       })
       .accounts({
         signer: admin.publicKey,
         // @ts-ignore
         game: gamePda(initiator),
         gameSession: gameSessionPda,
         config: gameConfigPda,
         systemProgram: SystemProgram.programId,
       })
       .signers([admin])
       .instruction()

       

       return tx
       
  
}
export async function startGame(){

    const tx = await program.methods
      .startGame()
      .accounts({
        player: initiator.publicKey,
        // @ts-ignore
        config: gameConfigPda,
        game: gamePda,
        systemProgram: SystemProgram.programId,
      })
      .signers([initiator])
      .rpc({commitment:"confirmed"});
      console.log("transaction hash: ",tx)
      return tx
}

export async function updateGameSession(initiator:PublicKey){
  

   const gameAccount = await program.account.game.fetch(gamePda(initiator));
   let  nonce = gameAccount.nonce;
 
  

   console.log("Game initiator: ",gameAccount.initiator.toBase58())
   console.log("Game nonce",nonce.toString())
   
    const  [gameSession] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("gamesession"),
        gameAccount.initiator.toBuffer(),
        Buffer.from(nonce.toArrayLike(Buffer, "be", 16))
      ],
      program.programId
    );

    console.log("Game session Pda",gameSession.toBase58()) 
      
    let {jumble,hashed_valid} = getJumbleAndHashedAnswer()
   
    

  

    try {
        const tx = await program.methods
        .uploadWord({
          jumbleWorld:jumble,
          validWords:hashed_valid
        })
        .accounts({
          signer: admin.publicKey,
          // @ts-ignore
          game: gamePda(initiator),
          gameSession: gameSession,
          config: gameConfigPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([admin])
        .rpc({commitment:"confirmed"});
        console.log("transaction hash: ",tx)
        return jumble
    } catch (error) {
        
        console.log("error uplaodaing");
        console.log(error)
    }

    console.log("Done")
    return jumble
   
}

export async function play(initiator:PublicKey,answer: string){

    
    const gameAccount = await program.account.game.fetch(gamePda(initiator));
    let nonce = gameAccount.nonce;

    const  [gameSessionPda] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("gamesession"), 
          initiator.toBuffer(), 
          Buffer.from(nonce.toArrayLike(Buffer,"be", 16))
        ],
        program.programId
      );

      console.log("nonce play",nonce.toString())

      console.log("GameSession Play PDA: ", gameSessionPda.toBase58());
      console.log("Game status: ",gameAccount.status)

      try {
        
     
    const tx = await program.methods
    .play(answer)
    .accounts({
      signer: initiator,
       // @ts-ignore
      game: gamePda(initiator),
     
      gameSession: gameSessionPda,
      config: gameConfigPda,
      systemProgram: SystemProgram.programId,
    }).instruction()
    // .signers([initiator])
    // .rpc({commitment:"confirmed"});
    
    return tx
} catch (error) {
      console.log(error)  

}


   

   
}

export async function listen(){
    
  
    const eventListener = program.addEventListener(
        "startGameEvent", 
        async (event, slot) => {

            
            console.log("event called slot: ",slot)
            const currentTime = new Date();
            console.log(`Hello World! Message received at: ${currentTime.toISOString()}`);
            try {
                
                //await updateGameSession(event.nonce,event.player)
                
              } catch (error:any) {
                //res.status(500).json({ success: false, error:  });
                console.log(error.message)
              }
          
        }
      );
      console.log("Listener",eventListener)
}


function createHeliusWebSocketListener() {
    
    const url = `wss://devnet.helius-rpc.com/?api-key=e30a8b1e-1deb-4f7a-89bf-60b149f39320`;
  
    const ws = new WebSocket(url);
  
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