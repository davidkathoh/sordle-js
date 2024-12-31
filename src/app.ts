import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { console } from 'inspector';
import { getJumbleAndHashedAnswer, hash, uint8ArrayToBase64 } from './utils';
import { setAdmin, startGame, updateGameSession, play, listen, ixStartGame, program, ixUpdateGameSession } from './update_program';
import { actionCorsMiddleware, ActionGetResponse, ActionPostRequest, ActionPostResponse,ACTIONS_CORS_HEADERS, ActionsJson, createPostResponse, createActionHeaders} from '@solana/actions';
import { clusterApiUrl, ComputeBudgetProgram, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionStatus } from '@solana/web3.js';
import { admin, delay, gamePda, gameSessionPda, initiator } from './constants';

const app = express();
const PORT = 3000;

const connection = new Connection("https://devnet.helius-rpc.com/?api-key=e30a8b1e-1deb-4f7a-89bf-60b149f39320");
app.use(express.json());
//app.use(actionCorsMiddleware())
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization', 'Accept-Encoding'],
    allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  }),
);

  
const headers = createActionHeaders({
  chainId: "devnet", // or chainId: "devnet"
  actionVersion: "1.6.6", // the desired spec version
});




app.get('/actions.json', (req, res) => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/",
        apiPath: "/",
      },
    ],
  };


  console.log("actions called")

  // Add the CORS headers and send JSON response
  res.set(headers)
     .json(payload);
});

// app.options('/actions.json', (req, res) => {

//   console.log("opions")
//   res.set(ACTIONS_CORS_HEADERS)
//      .sendStatus(200);
// });

// Define a simple route
app.get('/', (req: Request, res: Response) => {
     const response:ActionGetResponse = {
       type:"action" ,
       icon: 'https://storage.googleapis.com/sordle/images/jumble.svg',
       title: 'Sordle',
       description: 'Embark on an exciting journey to solve the most puzzling jumbled words! Challenge yourself, earn points, and conquer the leaderboard. Press Start Game to begin your adventure!',
       label: 'start game',
     
     }

    
  
     res.set(headers).send(response)

});
// app.post("/answer",async(req:Request, res:Response)=>{

//   process.stdout.write(`📋 Pr: ${JSON.stringify(req.body)}\n`);
  
//   res.send()

// })
app.post("/", async(req: Request, res: Response) => {

  
console.log("post called");

  try {
    const body:ActionPostRequest = req.body;
    let account = new PublicKey(body.account)

    const transaction = new Transaction();
    transaction.feePayer = account

    const recentBlockahs = (await connection.getLatestBlockhash()).blockhash
    

  
    transaction.recentBlockhash = recentBlockahs

    let response:ActionPostResponse
   // try {
      
   
    
    const accountInfo = await  connection.getAccountInfo(gamePda(account))
    if(accountInfo ===  null){
      // start a game
      transaction.add(
        await ixStartGame(account)
      )
      process.stdout.write(`📋 start: accountInfo ===  null`);
     // transaction.add(await ixUpdateGameSession(0,account))
    }else{
      const gameAccount = await program.account.game.fetch(gamePda(account));
      const status = getGameStatus(gameAccount);
      const minutesPass = getMinutesSinceLastUpdate(gameAccount);
      process.stdout.write(`📋 start: ${JSON.stringify(gameAccount)}`);
    
      if(minutesPass < 3 && status === "INITIATED"){

        process.stdout.write(`📋 start: minutesPass < 3 && status === "INITIATED" \n`);
      }else if(minutesPass > 3){
        //start game
          transaction.add( await ixStartGame(account) )
          process.stdout.write(`📋 start: minutesPass > 3 \n`);
      }
    
    }

    response = {
      type: "transaction",
      transaction:uint8ArrayToBase64(transaction.serialize({requireAllSignatures:false, verifySignatures:false})),
      message:"Game started",
      links:{
       next: {
            type:"post",
            href:req.url+"uploa",
            
          }
        
       }
          
        }
       
      

    
  // } catch (error) {
  //     console.log(error)
  // }
   let respons:ActionGetResponse = {
      type:"action" ,
      icon: 'https://storage.googleapis.com/sordle/images/ikaiwk.svg',
      title: 'Sordle',
      description: 'This a word geussing game',
      label: 'game started',
      error:{message:"error in the blink"}
    }

    console.log("hrllo cathoh")
 
  //  res.set(ACTIONS_CORS_HEADERS).send(response)
   
    res.set(headers).json(response)
  } catch (error) {
    throw error
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
  });

  app.post("/answer", async(req,res)=>{

    
    const body = req.body;
    process.stdout.write(`📋 answer  : ${JSON.stringify(body)}\n`);
    const account = new PublicKey(body.account)

    let response;
    if("signature" in req.body){
      const gameAccount = await program.account.game.fetch(gamePda(account));
      const gameSession = await program.account.gameSession.fetch(gameSessionPda(gameAccount.nonce,account))
      process.stdout.write(`📋 answer  : valid \n`);

       response= {
        type:"action" ,
        icon: `https://storage.googleapis.com/sordle/images/${gameSession.jumbleWorld}.svg`,
        title: 'Sordle',
        description: 'Hint: Pay attention to the above  scrambled letters.',
        label: 'game started',
        error:{message:"error in the blink"},
        links:{
          actions:[
            {
              label: "submit",
              href: req.baseUrl + "/answer",
              parameters: [
                {
                  name: "word",
                  label: "Type a correct word:"
                }
              ]
             
              ,
              type: 'post'
            }
                ]
              
                }
              
      }
      res.set(headers).json(response)
    }else{
      const word = body.data.word
      const gameAccount = await program.account.game.fetch(gamePda(account));
      const gameSession = await program.account.gameSession.fetch(gameSessionPda(gameAccount.nonce,account))
      const transaction = new Transaction();
      transaction.feePayer = account
  
      const recentBlockahs = (await connection.getLatestBlockhash()).blockhash
      
  
    
      transaction.recentBlockhash = recentBlockahs
 
     let tx = await play(account, word)
 
     transaction.add(tx)
     
     const simulation = await connection.simulateTransaction(transaction);
 if (simulation.value.err) {
  const customCode = JSON.parse(JSON.stringify(simulation.value)).err?.InstructionError[1]?.Custom;

  if(customCode == 6006){
    //game over show score
    res.status(200).json({ error:  "Game over " });
  }else if(customCode == 6000){
// not permitted
res.status(200).json({ error:  "This wallet is not permited " });
  }
  else if(customCode == 6001){
    
            
    res.status(200).json({ error:  "Not a valid word, try again" });

  }
  else if(customCode == 6002){
    // already submitted word
    res.status(200).json({ error:  "Already submitted, try another word" });

  }
    
 }else{
     response ={
       type: "transaction",
       transaction:uint8ArrayToBase64(transaction.serialize({requireAllSignatures:false, verifySignatures:false})),
       message:"Game started",
       
       links:{
        next: {
             type:"post",
             href:req.baseUrl+"/answer",
             
           }
         
        }
     }

     res.set(headers).json(response)
    }
  }
     
     process.stdout.write(`📋 answer  : ${JSON.stringify(body)}\n`);
    
     

    
  })
  app.post("/uploa", async(req,res)=>{

    const body:ActionPostRequest = req.body;
    let account = new PublicKey(body.account)

   
    const transaction = new Transaction();
    transaction.feePayer = account

    const latestBlockhash = await connection.getLatestBlockhash()
    let signature = req.body.signature
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    }, 'finalized');
    
   
    const recentBlockahs = latestBlockhash.blockhash
    

  
    transaction.recentBlockhash = recentBlockahs

    let response:ActionPostResponse
   
    let image
    try {
    
    let gameAccount = await program.account.game.fetch(gamePda(account));
   
    let  status = getGameStatus(gameAccount);
    const minutesPass = getMinutesSinceLastUpdate(gameAccount);
    image =   await updateGameSession(account)

    } catch (error) {
      process.stdout.write(`📋 upload: ${error}\n`);
      console.log(error)
      
    }

    let respons:ActionGetResponse = {
      type:"action" ,
      icon: `https://storage.googleapis.com/sordle/images/${image}.svg`,
      title: 'Sordle',
      description: 'Hint: Pay attention to the above  scrambled letters.',
      label: 'game started',
      error:{message:"error in the blink"},
      links:{
        actions:[
          {
            label: "submit",
            href: req.baseUrl + "/answer",
            parameters: [
              {
                name: "word",
                label: "Type a correct word:"
              }
            ],
            type: 'post'
          }
              ]
            
              }
            
    }

    console.log("hrllo cathoh")
 
  //  res.set(ACTIONS_CORS_HEADERS).send(response)
   
    res.set(headers).json(respons)


  })
app.post("/admin", async (req, res) => {
    try {
      const tx = await setAdmin();
      res.json({ success: true, tx });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Route to start the game
  app.post("/start-game", async (req, res) => {
    try {
      const tx = await startGame();
      res.json({ success: true, tx });
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Route to update the game session
  app.post("/update-game-session", async (req, res) => {
    try {
     // const tx = await updateGameSession(initiator.publicKey);
     // res.json({ success: true, tx });
    } catch (error:any) {
      console.log(error)
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Route to submit a player's answer
  app.post("/play", async (req, res) => {
    const { answer } = req.body;
    try {
      //const tx = await play(answer);
      res.json({ success: true });
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Event Listener to listen for game events (startGameEvent)
 
   //  listen();
      


// Start the server
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
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