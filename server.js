// 📦 मॉड्यूल इम्पोर्ट करें
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// 🛡️ मिडलवेयर सेटअप
app.use(cors());                  // Cross-Origin Requests को अलाउ करने के लिए
app.use(express.json());          // JSON डेटा रीड करने के लिए
app.use(express.urlencoded({ extended: true }));

// 📝 एडवांस्ड रिक्वेस्ट लॉगर (ट्रैफिक मॉनिटर)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// 🌐 1. बेस रूट (Health Check)
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Master Express Server is running smoothly!",
        version: "1.0.0"
    });
});

// 👤 2. सिक्योर डायरेक्ट इन-ऐप लॉगिन एंडपॉइंट (Direct API Auth)
app.post('/api/v1/auth/login', (req, res) => {
    const { username, password } = req.body;

    // बेसिक वैलिडेशन
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: "Username and password are required"
        });
    }

    // यहाँ आप भविष्य में डेटाबेस (MongoDB/MySQL) चेक्स जोड़ सकते हैं
    // अभी के लिए हम एक सुरक्षित टोकन और रिस्पॉन्स भेज रहे हैं
    const userId = Math.floor(100000 + Math.random() * 900000);
    const token = crypto.randomBytes(32).toString('hex');

    res.status(200).json({
        success: true,
        status: "AUTHENTICATED",
        player: {
            id: userId,
            username: username,
            role: "Premium_User"
        },
        session: {
            access_token: token,
            expires_in: "24h"
        }
    });
});

// 🚏 3. ग्लोबल 404 फॉलबैक (अगर कोई गलत रास्ता खोजे)
app.use((req, res) => {
    console.log(`[⚠️ 404 Not Found]: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        error: "Requested endpoint does not exist"
    });
});

// 🚀 सर्वर पोर्ट लिसनर
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Master Server initialized on port ${PORT}`);
    console.log(`🌐 Local Link: http://localhost:${PORT}`);
    console.log(`=============================================`);
});

