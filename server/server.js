require("dotenv").config();
const express = require("express");
const dbConfig = require("./config/dbConfig.js");
const app = express();
const port = process.env.PORT || 5000;
const userRoute = require("./routes/usersRoute.js");
const productRoute = require("./routes/productsRoute.js");
const bidsRoute = require("./routes/bidsRoutes.js");
const notificationsRoute = require("./routes/notificationsRoute.js");

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/bids", bidsRoute);
app.use("/api/notifications/", notificationsRoute);

app.listen(port, function() {
    console.log(`Server started on port ${port}.`);
});