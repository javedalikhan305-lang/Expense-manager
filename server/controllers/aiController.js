import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_APIKEY;
if (!geminiApiKey) {
  throw new Error('Missing Gemini API key. Set GEMINI_API_KEY, API_KEY, or GOOGLE_API_KEY.');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

export const getInsights = async (req, res) => {
  const { expenses } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze these expenses and provide financial insights, including spending patterns, budgeting advice, and potential savings. Respond in a clean, readable text format:\n\n${JSON.stringify(expenses)}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ insights: text });
  } catch (error) {
    res.status(500).json({ message: 'Error generating insights', error: error.message });
  }
};

export const scanReceipt = async (req, res) => {
  const { imageUrl, mimeType = 'image/jpeg' } = req.body;
  try {
    // If the image is provided as a Cloudinary URL, we would normally download it 
    // and pass it as base64 to Gemini. For simplicity or if base64 is provided directly:
    // Let's assume the frontend sends the base64 image data or we fetch the URL.
    
    let base64Data = req.body.base64Data;
    
    if (!base64Data && imageUrl) {
      // Fetch from URL
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      base64Data = Buffer.from(arrayBuffer).toString('base64');
    }

    if (!base64Data) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const prompt = `Analyze this receipt image and extract the following details to categorize the expense.
Return a strictly valid JSON object with the following keys:
- amount (number)
- category (string, best fit from: Food, Transport, Utilities, Entertainment, Health, Shopping, Other)
- description (string, merchant name or brief description)
- date (string, YYYY-MM-DD format if found, otherwise omit)

Only return the JSON. No markdown or other text.`;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = await response.text();

    // Clean up potential markdown formatting from Gemini response
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parseJson = (jsonString) => {
      const start = jsonString.indexOf('{');
      const end = jsonString.lastIndexOf('}');
      if (start === -1 || end === -1) {
        throw new Error('Unable to extract JSON from model output');
      }
      return JSON.parse(jsonString.slice(start, end + 1));
    };

    const extractedData = parseJson(text);

    res.json(extractedData);
  } catch (error) {
    console.error('scanReceipt error:', error);
    res.status(500).json({ message: 'Error scanning receipt', error: error.message });
  }
};
