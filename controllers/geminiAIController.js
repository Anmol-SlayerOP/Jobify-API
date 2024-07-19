
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.Gemini_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const generateResume = async (req, res) => {
    try{
    const  params  = req.body;

    const prompt = params.prompt;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    res.json(text);
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error: 'Failed to generate resume' });
    }

}


module.exports = { generateResume }
