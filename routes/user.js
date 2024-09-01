const express = require("express")
const { handleSignUp, handleLogin, handleUpdateUser, handleGetUserById, handleGetUserByType, handleVerifyOtp, handleSendOtpForResetPassword, handleVerifyOtpForResetPassword, handleResetPassword } = require("../controllers/user")
const { handleGetUserByAuthToken } = require("../middlewares/auth")
const axios = require("axios")
const router = express.Router()

router.post("/", handleSignUp)
router.post("/verify", handleVerifyOtp)
router.post("/reset/sendOtp", handleSendOtpForResetPassword)
router.post("/reset/verifyOtp", handleVerifyOtpForResetPassword)
router.post("/reset/", handleResetPassword)
router.post("/login", handleLogin)
router.get("/", handleGetUserByAuthToken, handleGetUserById)
router.get("/:userType", handleGetUserByAuthToken, handleGetUserByType)
router.patch("/", handleGetUserByAuthToken, handleUpdateUser)

router.post('/send-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    const sid = process.env.EXOTEL_SID || "touristjunction1";
    const apiKey = process.env.EXOTEL_API_KEY || "a74699639965d0a83aa617978a045d0d1e04db0afe5b3055";
    const apiToken = process.env.EXOTEL_API_TOKEN || "fce157c9fd6c7eff6f23f2b4e17168161d89323f005e2eff";
    const sender = process.env.EXOTEL_SENDER;
    const message = `Your OTP code is ${otp}`;

    const url = `https://${apiKey}:${apiToken}@api.exotel.com/v1/Accounts/${sid}/Sms/send`;

    const params = new URLSearchParams();
    params.append('From', sender);
    params.append('To', phoneNumber);
    params.append('Body', message);

    try {
        const response = await axios.post(url, params);
        const body = response.data;

        if (body && body.SmsMessage) {
            res.status(200).send(`OTP sent to ${phoneNumber}`);
        } else {
            res.status(500).send(body);
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


module.exports = router