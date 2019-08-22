const express = require("express");
const app = express();
const os = require("os");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require('cors')

app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000"]
}))
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/api/user", (req, res, next)=>{

    fs.readFile("user.txt", (err, data)=>{
        if(err) console.log(err);
        const index = data.indexOf(os.userInfo().username);
        res.status(200).send({
            name:os.userInfo().username,
            alreadySubmitted: index !== -1
        });
    });


});

app.post("/api/order", (req, res, next) =>{
    const { data } =req.body;
    const user = data.split(",")[0];
    
    fs.appendFile("user.txt", `${user},`, (err)=>{
        if(err) console.log(err);
        fs.appendFile("user-order.csv", `${data}\n` , (error)=>{ 
            if(error) console.log(error);
           setTimeout(()=>{
            res.status(200).send("Your order has been submitted successfully.");
           }, 4000)
        });
    });
});

app.get("*", (req, res, next) =>{
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(7000, () =>{
    console.log("Server is listening on Port 7000");
});