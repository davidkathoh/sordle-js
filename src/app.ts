import express, { Request, Response } from 'express';
import { console } from 'inspector';
import { getJumbleAndHashedAnswer, hash } from './utils';
import { setAdmin, startGame, updateGameSession, play, listen } from './update_program';

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});
// Define a simple route
app.get('/sordle', (req: Request, res: Response) => {
    
    
    res.send("hello");
});
app.post("/", (req: Request, res: Response) => {
    const receivedData = req.body;
  
    // Log the received data to the console
    console.log("Received POST data:", receivedData);
  
    // Send a response back to the client
    res.json({
      message: "Data received successfully",
      receivedData,
    });
  });
app.post("/sordle/admin", async (req, res) => {
    try {
      const tx = await setAdmin();
      res.json({ success: true, tx });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Route to start the game
  app.post("/sordle/start-game", async (req, res) => {
    try {
      const tx = await startGame();
      res.json({ success: true, tx });
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Route to update the game session
  app.post("/sordle/update-game-session", async (req, res) => {
    try {
      //const tx = await updateGameSession();
      //res.json({ success: true, tx });
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Route to submit a player's answer
  app.post("/sordle/play", async (req, res) => {
    const { answer } = req.body;
    try {
      const tx = await play(answer);
      res.json({ success: true, tx });
    } catch (error:any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  // Event Listener to listen for game events (startGameEvent)
 
     listen();
      


// Start the server
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
