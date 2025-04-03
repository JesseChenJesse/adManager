const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateArticle = async (req, res) => {
  try {
    const { theme, style, keywords } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `生成一篇${style}风格的软文，主题：${theme}。
    要求：
    1. 包含关键词：${keywords.join(', ')}
    2. 语言自然流畅，符合${style}风格
    3. 字数800-1000字
    4. 包含3-5个小标题`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({
      content: response.text(),
      generatedAt: new Date()
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
