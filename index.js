const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid');

app.use(cors());
app.use(express.json());

const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination: (req,file,cb)=>{
       cb(null, './public/images')
   },
   filename: (req,file,cb) =>{
           cb(null, file.originalname)
       }
   });
   const upload = multer({storage: fileStorageEngine});

app.post('/murals', upload.single("uploadImage"), (req,res)=>{

    let createdMuralObject = {
        'title' : req.body.title,
        'author' : req.body.author,
        'image' : req.file,
        "description" :  req.body.description,
        "likes" : "0",
        "timestamp" : Date.now(),
        "socials" : req.body.socials,
        "location": req.body.location,
        "id" : uuidv4()
    }

    let jsonData = readData();
    jsonData.push(createdMuralObject);
    const updatedData = JSON.stringify(jsonData);
    fs.writeFileSync("./data/data.json", updatedData);
    
    res.status(201).json(createdMuralObject);
});

app.get('/murals',(req,res)=>{
    res.send(JSON.stringify(
        readData().map(
            (mural)=>{
                return {
                    "title": mural.title,
                    "image": mural.image,
                    "location": mural.location,
                    "id": mural.id,
                    "author": mural.author
                };
            }
        )
    ));
});


//get info on this user only!
app.get('/users/:username',(req,res)=>{
    res.send(JSON.stringify(
        readUserData().filter(
            (user)=>{
                return req.params['username'] === user.username;
            }
            
        )
    ));
});

//gets all collections
app.get('/users/:username/collections',(req,res)=>{
    res.send(JSON.stringify(
        readUserData().filter(
            (user)=>{
                return req.params['username'] === user.username;
            }
        ).map((user)=>{
            return user.collections;
        })
    ));
});

//gets all ids in a named collection
app.get('/users/:username/:collections/:name',(req,res)=>{
    res.send(JSON.stringify(
        readUserData().filter(
            (user)=>{
                return req.params['username'] === user.username;
            }
        ).filter(
            (collection)=>{
                return req.params['name'] === collection.name;
            }
        )
    ));
});

//gets all username uploads
app.get('/users/:username/:uploads',(req,res)=>{
    res.send(JSON.stringify(
        readUserData().filter(
            (user)=>{
                return req.params['username'] === user.username;
            }
        ).map((user)=>{
            return user.uploads;
        })
    ));
});

app.get('/users/:username/collections',(req,res)=>{
    res.send(JSON.stringify(
        readUserData().filter(
            (user)=>{
                return req.params['username'] === user.username;
            }
        ).map((user)=>{
            return user.collections;
        })
    ));
});

app.get('/auctions',(req,res)=>{
    res.send(JSON.stringify(
        {   auctions : readAuctionData().map(
                (auction)=>{
                    return {competitionName: auction.competitionName};
                }
            ),
            top: readAuctionData().map(
                (auction)=>{
                    return {competitionName: auction.competitionName};
                }
            ).sort( 
                (a,b) =>{
                    return b.votes - a.votes;
                }
            )
        }
    ));
});

app.get('/auctions/:auctionID',(req,res)=>{
    res.send(JSON.stringify(
        readAuctionData().filter(
            (auction)=>{
                return req.params['auctionID'] === auction.id;
            }
        ).sort( 
            (a,b) =>{
                return b.votes - a.votes;
            }
        )
    ));
});

function readData(){
    const notesData = fs.readFileSync("./data/data.json");
    const parsedData = JSON.parse(notesData);
    return parsedData;
}

function readUserData(){
    const notesData = fs.readFileSync("./data/users.json");
    const parsedData = JSON.parse(notesData);
    return parsedData;
}
function readAuctionData(){
    const notesData = fs.readFileSync("./data/competitions.json");
    const parsedData = JSON.parse(notesData);
    return parsedData;
}


//http://localhost:8080/images/ to get the image
app.use('/images', express.static('public/images'));

app.listen(8080, function(){
    console.log('hello wynwood!');
});