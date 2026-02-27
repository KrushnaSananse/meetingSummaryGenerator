// require("dotenv").config();
const express = require("express");

const cors = require("cors");


const summaryRoute = require("./routes/summaryRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/summary",summaryRoute);

app.listen(5000,()=>{
    console.log("Server running on port 5000");
})