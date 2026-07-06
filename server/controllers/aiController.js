import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── GET AI INSIGHTS ──────────────────────────────────────────
export const getInsights = async (req, res) => {
  const { expenses } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Analyze these expenses and provide financial insights, including spending patterns, budgeting advice, and potential savings. Respond in a clean, readable text format:\n\n${JSON.stringify(expenses)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || 'No insights generated.';
    res.json({ insights: text });
  } catch (error) {
    console.error('getInsights error:', error);
    res.status(500).json({ message: 'Error generating insights', error: error.message });
  }
};

// ── SCAN RECEIPT (Vision) ─────────────────────────────────────
export const scanReceipt = async (req, res) => {
  const { imageUrl, mimeType = 'image/jpeg' } = req.body;
  try {
    let base64Data = req.body.base64Data;

    // Fetch from URL if base64 not provided
    if (!base64Data && imageUrl) {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      base64Data = Buffer.from(arrayBuffer).toString('base64');
    }

    if (!base64Data) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const imageDataUrl = `data:${mimeType};base64,${base64Data}`;

    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this receipt image and extract the following details to categorize the expense.
Return a strictly valid JSON object with the following keys:
- amount (number)
- category (string, best fit from: Food, Transport, Utilities, Entertainment, Health, Shopping, Other)
- description (string, merchant name or brief description)
- date (string, YYYY-MM-DD format if found, otherwise omit)

Only return the JSON. No markdown or other text.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
              },
            },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 512,
    });

    let text = completion.choices[0]?.message?.content || '';

    // Clean up potential markdown formatting
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
