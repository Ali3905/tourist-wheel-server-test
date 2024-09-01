const express = require("express")
const cors = require("cors")
require("dotenv").config()
const data = require("./data")
const subscriptionCronJob = require("./cron/subscription")
const packageBookingCronJob = require("./cron/packageBookingReminder")

const driverRoute = require("./routes/driver")
const cleanerRoute = require("./routes/cleaner")
const employeeRoute = require("./routes/employee")
const authRoute = require("./routes/user")
const technicianRoute = require("./routes/technician")
const dailyRouteRoute = require("./routes/dailyRoute")
const vehicleRoute = require("./routes/vehicle")
const packageBookingRoute = require("./routes/packageBooking")
const serviceRoute = require("./routes/vehicleService")
const subscriptionRoute = require("./routes/subscription")
const emptyVehicleRoute = require("./routes/emptyVehicle")
const busRouteRoute = require("./routes/busRoute")
const tourRoute = require("./routes/tour")

const { handleGetUserByAuthToken, handleAuthorizeUserByRole } = require("./middlewares/auth")
const { connectToMongo } = require("./connections")
const technician = require("./models/technician")

const PORT = process.env.PORT || 5000
const app = express()
connectToMongo(process.env.MONGO_URL)
    .then(console.log("Mongo Connected"))
    .catch(err => console.log(err.message))


app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const SMARTPING_API_KEY = 'your-smartping-api-key';
const SMARTPING_API_URL = 'https://api.smartping.io/send-otp';

// For Testing
app.get("/", async (req, res) => {
    res.send("Home page of tourist wheel")
})

app.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const response = await axios.post(SMARTPING_API_URL, {
            apiKey: SMARTPING_API_KEY,
            phone: phoneNumber
        });

        if (response.data.success) {
            res.status(200).json({ message: 'OTP sent successfully.' });
        } else {
            res.status(500).json({ message: 'Failed to send OTP.' });
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP.' });
    }
});

app.post("/addBulkTechnicians", async (req, res) => {
    try {
        const bulkOps = data.map(doc => ({
            insertOne: {
                document: doc
            }
        }));

        const result = await technician.bulkWrite(bulkOps);
        res.send(`Inserted ${result.insertedCount} documents successfully`);
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: err.message });
    }
})


// Routes
app.use("/api/driver", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), driverRoute);
app.use("/api/cleaner", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), cleanerRoute);
app.use("/api/employee", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), employeeRoute);
app.use("/api/user", authRoute);
app.use("/api/technician", handleGetUserByAuthToken, technicianRoute);
app.use("/api/dailyRoute", dailyRouteRoute);
app.use("/api/vehicle", handleGetUserByAuthToken, vehicleRoute);
app.use("/api/packageBooking", packageBookingRoute)
app.use("/api/service", serviceRoute);
app.use("/api/subscription", subscriptionRoute);
app.use("/api/emptyVehicle", emptyVehicleRoute);
app.use("/api/busRoute", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), busRouteRoute);
app.use("/api/tour", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), tourRoute)


app.listen(PORT, () => {
    console.log("Server is running on " + PORT);
    subscriptionCronJob()
    packageBookingCronJob()
})




