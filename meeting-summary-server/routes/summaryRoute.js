const express = require("express");
const router = express.Router();
// const { generateSummary } = require("../services/aiServiceOpenAI");
const { generateSummary } = require("../services/aiServicellama3");

router.post("/",async(req,res)=>{
    console.log("at 6");
    try { 
        const { transcript, section } = req.body;
        console.log("at 10",transcript);
        console.log("at 11",section);
        const result = await generateSummary(transcript, section);
        console.log("Result : ",result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Route Error:", error);

        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
})

module.exports = router;