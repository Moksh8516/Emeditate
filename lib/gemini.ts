import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const GeminiResponse = async (prompt: string): Promise<string | undefined> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // updated model name

    const result = await model.generateContent(prompt);
    const response = await result.response; // await the response

    if (!response.text) {
      console.log("Empty response from Gemini");
      return undefined;
    }

    return response.text(); // extract text from response
  } catch (error) {
    console.error("Error in gemini.ts file", error);
    return undefined;
  }
};