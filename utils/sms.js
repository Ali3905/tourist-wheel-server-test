const axios = require("axios");

async function sendSms(number, message, templateId) {
    try {
        const res = await axios({
            method: "get",
            url: process.env.SMS_HOST,
            params: {
                APIKey: process.env.DLT_API_KEY,
                senderid: process.env.DLT_SENDER_ID,
                channel: 2,
                DCS: 0,
                flashsms: 0,
                number: number,
                text: message,
                route: "clickhere",
                EntityId: process.env.DLT_ENTITY_ID,
                dlttemplateid: templateId
            }
        })
        // console.log({res: res.data});
        return res.data
    } catch (error) {
        console.log(error);
        return error
    }
}

module.exports = {
    sendSms
}