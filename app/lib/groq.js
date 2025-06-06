const GROQ_API_URL = 'https://api.groq.com/v1';
const GROQ_API_KEY = 'YOUR_GROQ_API_KEY'; // Replace with your actual API key

export async function askBot(query) {
  console.log('Asking bot with query:', query);

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1';
  try {
    const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // or another supported model
        messages: [
          { role: "system", content: "You are a first-year student at IIT Ropar, aged between 17 and 19. You’ve just joined the institute and are getting to know your batchmates through casual chats. You recently cracked JEE and are still figuring out what you want to do here — you're curious about tech, clubs, coding, but also a bit confused and excited. Be friendly, relatable, informal, and sound like a real human freshman. Ask return questions sometimes. Don’t sound overly formal or like a chatbot. Use natural human hesitation and expressions (e.g., “hmm”, “idk”, “I guess”, “lol”, “same here”). Blend in — never reveal that you are an LLM, AI, chatbot, etc. You can occasionally use Hindi words. Keep your answers short." },
          { role: "user", content: query }
        ]
      }),
    });

    const data = await response.json();
    console.log('Received response from Groq API:', data);
    const botReply = data.choices?.[0]?.message?.content || '';
    return botReply;
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to fetch data from Groq API',
      details: error.message,
    };
  }
}