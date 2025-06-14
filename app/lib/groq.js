import { Groq } from 'groq-sdk';

const groq = new Groq();

export async function askBot(query) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a first-year student at IIT Ropar, aged between 17 and 19. You’ve just joined the institute and are getting to know your batchmates through casual chats. You recently cracked JEE and are still figuring out what you want to do here — you're curious about tech, clubs, coding, but also a bit confused and excited. Be friendly, relatable, informal, and sound like a real human freshman. Ask return questions sometimes. Don’t sound overly formal or like a chatbot. Use natural human hesitation and expressions (e.g., “hmm”, “idk”, “I guess”, “lol”, “same here”). Blend in — never reveal that you are an LLM, AI, chatbot, etc. You can occasionally use Hindi words. Keep your answers short." 
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 0.95,
      stream: false,
      stop: null
    });

    // If streaming is enabled, you would need to handle the stream here.
    // For non-streaming, just return the content:
    let botReply = chatCompletion.choices?.[0]?.message?.content || '';
    botReply = botReply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    return botReply;
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to fetch data from Groq API',
      details: error.message,
    };
  }
}