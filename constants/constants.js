const ratingMessages = [
    {
        rating: 1,
        message: "very bad"
    },
    {
        rating: 2,
        message: "bad"
    },
    {
        rating: 3,
        message: "average"
    },
    {
        rating: 4,
        message: "good"
    },
    {
        rating: 5,
        message: "very good"
    },
]

const subscriptionPlans = {
    MONTHLY: {
        duration: 2592000, // seconds
        price: 300, // price in your currency
        id: process.env.RAZOR_PAY_MONTHLY_PLAN_ID
    },
    YEARLY: {
        duration: 31536000, // seconds
        price: 1000, // price in your currency
        id: process.env.RAZOR_PAY_YEARLY_PLAN_ID
    }
};

module.exports = {
    ratingMessages,
    subscriptionPlans
}