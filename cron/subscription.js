const cron = require('node-cron');
const { agency } = require("../models/user");
const subscription = require('../models/subscription');


module.exports = () => {
    cron.schedule('0 1 * * *', async () => {
        try {
            const now = new Date();
            const expiredSubscriptions = await subscription.find({ endDate: { $lt: now }, isValid: true });
            // console.log("cron running");
            if (expiredSubscriptions.length < 1) {
                return;
            }
            // console.log(expiredSubscriptions);
            expiredSubscriptions.forEach(async (subscription) => {
                // handle expired subscription (e.g., deactivate agency)
                await handleExpiredSubscription(subscription);
            });
        } catch (error) {
            console.error("Error in cron job:", error.message);
        }
    });
}

async function handleExpiredSubscription(subscription) {
    const foundAgency = await agency.findById(subscription.agency._id);
    if (foundAgency) {
        console.log(foundAgency.isSubsciptionValid);
        foundAgency.isSubsciptionValid = false;
        await foundAgency.save();
    }
    subscription.isValid = false
    await subscription.save()
}

