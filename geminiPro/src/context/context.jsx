import { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Adds typing delay effect
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  // Reset state for a new chat
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setResultData("");
  };

  // Sending prompt to backend
  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input)
    

    const currentPrompt = prompt ?? input; // Use `prompt` or fallback to `input`
    setRecentPrompt(currentPrompt);

    if (!prompt) {
      setPrevPrompts((prev) => [...prev, currentPrompt]);
    }

    const url = "http://localhost:3001/chat"; // Make sure your backend is running on this URL
    let response;

    try {
      const serverResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      if (!serverResponse.ok) throw new Error("Network response was not ok");

      const data = await serverResponse.json();
      response = data.response;
    } catch (error) {
      console.error("Error calling backend:", error);
      response = "Error: Could not connect to the server. Please ensure it is running.";
    }

    // Formatting response text
    let formattedResponse = response
  .split("**")
  .map((part, index) => (index % 2 === 1 ? `<b>${part}</b>` : part))
  .join("");

formattedResponse = formattedResponse.split("*").join("<br/>");

    // Simulate typing animation
    const words = formattedResponse.split(" ");
    words.forEach((word, index) => {
      delayPara(index, word + " ");
    });

    setLoading(false);
    setInput("");
  };

  // Context value shared across components
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
