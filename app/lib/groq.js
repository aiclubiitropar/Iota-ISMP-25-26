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
        messages: [{ role: "user", content: query }]
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