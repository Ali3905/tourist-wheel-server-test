const cron = require('node-cron');
const { agency } = require("../models/user");
const { sendSms } = require('../utils/sms');
const packageBooking = require('../models/packageVehicleBooking');


module.exports = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const currentDate = new Date();
            const twoDaysLater = new Date();
            twoDaysLater.setDate(currentDate.getDate() + 2);

            const bookingsWithLessThanTwoDaysOfDepartureDate = await packageBooking.find({
                departureDate: {
                    $lt: twoDaysLater,
                    $gt: currentDate
                },
                isNotified : false
            });
            // console.log("cron running");
            if (bookingsWithLessThanTwoDaysOfDepartureDate.length < 1) {
                return;
            }
            // console.log(expiredSubscriptions);
            bookingsWithLessThanTwoDaysOfDepartureDate.forEach(async (booking) => {
                // handle expired subscription (e.g., deactivate agency)
                booking.isNotified = true
                await sendSms(booking.mobileNumber, `Dear ${booking.customerName}, Your upcoming trip from ${booking.departurePlace} to ${booking.destinationPlace} is nearing. Please deposit the remaining payment at the ${"Tusharraj Agency"} office. Best regards, TOURIST JUNCTION PRIVATE LIMITED`)
                await booking.save()
            });
        } catch (error) {
            console.error("Error in cron job:", error.message);
        }
    });
}



