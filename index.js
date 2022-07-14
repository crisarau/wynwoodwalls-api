const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/murals',(req,res)=>{
    res.status(200).send("murals");
});

app.get('/users',(req,res)=>{
    res.status(200).send("users");
});

//http://localhost:8080/images/ to get the image
app.use('/images', express.static('public/images'))

app.listen(8080, function(){
    console.log('hello wynwood!');
});