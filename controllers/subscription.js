const crypto = require('crypto');
const { subscriptionPlans } = require("../constants/constants");
const subscription = require("../models/subscription");
const { agency } = require("../models/user");

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_API_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET
});


async function handleCreateSubscription(req, res) {
    try {
        const { plan } = req.body;

        const subscriptionPlan = subscriptionPlans[plan];
        if (!subscriptionPlan) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid plan"
            });
        }

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setSeconds(endDate.getSeconds() + subscriptionPlan.duration);




        const foundAgency = await agency.findById(req.data._id)
        if (!foundAgency) {
            return res.status(400).json({
                success: false,
                message: "Could not find agency with these creds"
            })
        }


        const createdSubscription = await subscription.create({
            agency: foundAgency,
            plan,
            startDate,
            endDate,
            monthlyRenewals: plan === 'MONTHLY' ? 1 : 0,
            yearlyRenewals: plan === 'YEARLY' ? 1 : 0,
            isValid: true
        });
        if (!createdSubscription) {
            return res.status(400).json({
                success: false,
                message: "Could not create subscription"
            })
        }
        const updatedAgency = await agency.findByIdAndUpdate(req.data._id, { isSubsciptionValid: true, subscription: createdSubscription }, { new: true })

        return res.status(201).json({
            success: true,
            data: createdSubscription
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleCreateOrder(req, res) {
    try {
        const { amount, currency, receipt, notes } = req.body;

        if (!amount || !currency || !receipt) {
            return res.status(400).json({
                success: false,
                message: "Provide all the required fields"
            })
        }

        const razorpayOrderOptions = {
            amount: amount * 100,
            currency,
            receipt,
            notes
        };
        const createdOrder = await razorpay.orders.create(razorpayOrderOptions);

        if (!createdOrder) {
            return res.status(400).json({
                success: false,
                message: "Could not create razor pay order"
            })
        }
        return res.status(201).json({
            success: true,
            data: createdOrder
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function handleCreateRazorPaySubscription(req, res) {
    try {
        const subOptions = {
            plan_id: process.env.RAZOR_PAY_TEST_PLAN_ID,
            customer_notify: 1,
            total_count: 12,
        }

        const createdRazorPaySubscription = await razorpay.subscriptions.create(subOptions);
        if (!createdRazorPaySubscription) {
            return res.status(400).json({
                success: false,
                message: "Could not subscribe to plan"
            })
        }

        return res.status(201).json({
            success: true,
            data: createdRazorPaySubscription
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function handleVerifyOrder(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Provide all the required fields"
            })
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZOR_PAY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.status(200).json({ success: true, message: "Payment Verified" });
        } else {
            res.status(400).json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleRenewSubcription(req, res) {
    try {
        const { plan } = req.body;
        const { subscriptionId } = req.params

        const subscriptionPlan = subscriptionPlans[plan];
        if (!subscriptionPlan) {
            return res.status(400).json({
                success: false,
                message: "Provide a Invalid plan"
            });
        }

        const foundSubscription = await subscription.findById(subscriptionId);
        if (!foundSubscription) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid subscription ID"
            });
        }
        const foundAgency = await agency.findById(req.data._id)
        if (foundAgency.subscription.toString() !== foundSubscription._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid subscription id"
            })
        }


        // Extend subscription end date based on new plan
        const newEndDate = new Date(foundSubscription.endDate.getTime() + subscriptionPlan.duration * 1000);
        foundSubscription.endDate = newEndDate;

        // Track renewals for each plan type

        foundSubscription.monthlyRenewals = (plan === 'MONTHLY') ? foundSubscription.monthlyRenewals + 1 : foundSubscription.monthlyRenewals
        foundSubscription.yearlyRenewals = (plan === 'YEARLY') ? foundSubscription.yearlyRenewals + 1 : foundSubscription.yearlyRenewals


        // Update the plan to the new plan
        foundSubscription.plan = plan;
        foundAgency.isSubsciptionValid = true

        await foundAgency.save();
        await foundSubscription.save();


        res.status(200).json({
            success: true,
            data: foundSubscription
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    handleCreateSubscription,
    handleRenewSubcription,
    handleVerifyOrder,
    handleCreateOrder,
    handleCreateRazorPaySubscription
}
