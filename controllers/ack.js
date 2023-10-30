const acknowledgement = (req, res)=>{
    let message = req.body.message || "Acknowledgement Accepted";
    // console.log(message);
    res.send("Acknowledgement Accepted");
}


module.exports = acknowledgement