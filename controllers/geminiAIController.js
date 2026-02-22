const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({apiKey: process.env.Gemini_API_KEY});

const generateResume = async (req, res) => {
    try{
    const  params  = req.body;

    const prompt = params.prompt;

    const response = await genAI.models.generateContent({
            model: process.env.GOOGLE_GEN_AI_MODEL,
            contents: prompt
    });

        res.json(response.text);
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error: 'Failed to generate resume' });
    }

}


module.exports = { generateResume }
