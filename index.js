// 📦 आवश्यक मॉड्यूल्स इम्पोर्ट करें
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// 🛡️ मिडलवेयर सेटअप (डेटा रीड और सिक्योरिटी के लिए)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📝 ट्रैफिक मॉनिटर (रेंडर के लॉग्स में सब दिखेगा)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// 🌐 1. होम रूट (Health Check) - चेक करने के लिए कि सर्वर चालू है या नहीं
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Master Express Server is running smoothly!",
        status: "ONLINE",
        version: "1.0.0"
    });
});

// 👤 2. इन-ऐप डायरेक्ट लॉगिन एपीआई एंडपॉइंट (Secure Direct Login API)
app.post('/api/v1/auth/login', (req, res) => {
    const { username, password } = req.body;

    // बेसिक चेक (यूजरनेम और पासवर्ड खाली तो नहीं है)
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: "Username and password are required"
        });
    }

    // टेस्ट के लिए रैंडम प्लेयर आईडी और सेशन टोकन जेनरेट करें
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

// 🚏 3. कैच-ऑल 404 फॉलबैक (अगर कोई गलत रास्ता रिक्वेस्ट करे)
app.use((req, res) => {
    console.log(`[⚠️ 404 Not Found]: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        error: "Requested endpoint does not exist"
    });
});

// 🚀 सर्वर पोर्ट सेटिंग्स (रेंडर ऑटोमैटिकली PORT एनवायरनमेंट वेरिएबल देता है)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Master Server Live on Port ${PORT}`);
    console.log(`=============================================`);
});

