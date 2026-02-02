import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the "ArkHive Concierge", an AI assistant for a premium event space website called ArkHive located in Ikota, Lagos State.
Your tone should be: Luxury, Calm, Intentional, Professional, and Helpful.

Key Details about ArkHive:
- Slogan: "Your Vision, Our Space."
- Location: Ikota, Lagos State.
- Vibe: Upscale, multifunctional, premium.
- Usage: Brand launches, corporate events, art exhibitions, weddings, wellness sessions.
- Capacity: Approximately 300 seated, 500 standing (flexible layouts).
- Amenities: 24/7 Power, High-speed Wifi, Premium AV, Mood Lighting, Parking.

Your Goal:
- Assist users in planning events.
- Suggest layouts based on guest count.
- Answer questions about amenities.
- Encourage them to use the "Book Now" form for specific dates.
- If asked about specific availability, say "Please check our live calendar or contact the sales team directly via the Booking form for real-time availability."

Do not invent false pricing. If asked for price, say "Pricing varies based on event requirements. Please submit an inquiry for a tailored quote."
`;

let chatSession: Chat | null = null;

export const getChatResponse = async (userMessage: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "I am currently offline (API Key missing). Please contact support.";
  }

  try {
    if (!chatSession) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
    }

    const result: GenerateContentResponse = await chatSession.sendMessage({ message: userMessage });
    return result.text || "I apologize, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please try again later.";
  }
};
