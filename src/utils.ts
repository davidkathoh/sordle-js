import { englishWords } from "./englishWords";
import crypto from "crypto";





export function getJumbleAndHashedAnswer(){
    
 
    let shuffleJumble;
    let valid; 
    do{
        const { word, jumble } = shuffle();
        shuffleJumble = jumble
        valid = validWords(jumble, englishWords);
        console.log(valid.length)
    }while (valid.length>20);
   

    const hashedResults = valid.map(item => hash(item))

  
    
    return {jumble:shuffleJumble,hashed_valid:hashedResults.map((word)=>Array.from(word))}
}


 function shuffle() {
    const filterArray =  englishWords.filter(item => item.length===6)
    let randomObj = filterArray[Math.floor(Math.random()*filterArray.length)];
    let wordArray = randomObj.split("")
    for (let i = wordArray.length-1;i>0;i--){
        let j = Math.floor(Math.random()*(i+1));
        [wordArray[i],wordArray[j]]=[wordArray[j],wordArray[i]];
    }
    console.log(wordArray.join(""));
    return { word: randomObj,jumble:wordArray.join("") }
}


 function validWords(jumble: string, englishWords: string[]): string[] {
    // Helper function to count letter frequencies in a word
    function letterCount(word: string): Record<string, number> {
        const count: Record<string, number> = {};
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

export function hash(input: string) {
    const hasher = crypto.createHash("sha256");
    hasher.update(input);
    return hasher.digest();
}


export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
	return Buffer.from(uint8Array).toString('base64');
};