
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import backgroundImage from './abc.png'; // Import the image

function App() {
 const [term, setTerm] = useState("");
 const [tldr, setTldr] = useState([]);
 const [completeText, setCompleteText] = useState("");
 const [stats, setStats] = useState([]);

 useEffect(() => {
   const search = async () => {
     // Wikipedia API to get information
     const response = await axios.get("https://en.wikipedia.org/w/api.php", {
       params: {
         action: "query",
         prop: "extracts",
         exintro: true,
         explaintext: true,
         format: "json",
         generator: "search",
         gsrsearch: term,
         gsrnamespace: 0,
         gsrlimit: 1,
         origin: "*",
       },
     });
 
     for (let page in response.data.query.pages) {
      let fullText = response.data.query.pages[page].extract;

      // Assume TLDR as the first three sentences. 
      const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [];
      const tldrSentences = sentences.slice(0, 3);
      setTldr(tldrSentences);

      // Extract sentences with numbers and consider them as stats.
      const statsLines = sentences.slice(3).filter(sentence => /\d/.test(sentence));
      setStats(statsLines);

      // Remove TLDR and stats sentences from fullText
      fullText = removeSentences(fullText, [...tldrSentences, ...statsLines]);
      setCompleteText(fullText);
    }
  };
  if (term) {
    search();
  }
}, [term]);
   

 //helper func

 function removeSentences(text, sentencesToRemove) {
  sentencesToRemove.forEach(sentence => {
    text = text.replace(sentence, '');
  });
  return text;
}

 return (
  <div style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: '100vh'}} className="App">
     <input 
       type="text" 
       placeholder="Search " 
       value={term} 
       onChange={(e) => setTerm(e.target.value)}
     />
     <p><strong>TLDR:</strong> {tldr.join(" ")}</p>
     <p><strong>Stats:</strong> {stats.join(" ")}</p>
     <p><strong>Additional Information:</strong> {completeText.substring(0,1000)}</p>
   </div>
 );
}

export default App;
