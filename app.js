const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const multer  = require('multer')
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const uri = "mongodb+srv://sharma123:w32hIrcPz1EL7Gwy@cluster0.ejosyev.mongodb.net/BlogG?retryWrites=true&w=majority";

mongoose.connect(uri).then((con) => {
    if (con) {
        console.log("Connected");
    } else
         console.log("Not Connected");
})

const imageStorage = multer.diskStorage({
    destination: '/images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
       
    }
});

const upload = multer({ storage: imageStorage });



const userSchema = new mongoose.Schema({
    title: String,
     
    file: {
        date: Date,
        data: Buffer,
        contentType: String
    },
    content: String
   

});

const post = new mongoose.model("post", userSchema);

app.get("/", (req, res) => {

    post.find({})
        .then(foundItems => {
           
            res.render("index",{found:foundItems})
        })
        .catch(err => {
            console.log(err);
        })
   
});




app.get('/signin', function (req, res) {

    res.sendFile(__dirname+"/public/signin.html");

})

app.get('/signup', function (req, res) {

    res.sendFile(__dirname+"/public/signup.html");

})
app.get('/compose', function (req, res) {

    res.sendFile(__dirname+"/public/compose.html");

})
app.post("/compose", upload.single('contentimage'),  (req, res) => {
    let postTitle = req.body.postTitle;
    var newImg = fs.readFileSync(req.file.path);
    var encImg = newImg.toString('base64');
    var newItem = {
        date: Date(),
        contentType: req.file.mimetype,
        data: Buffer(encImg)
    };
    let postContent = req.body.postBody;

    const newPost = new post({
        title: postTitle,
        file: newItem,
        content: postContent

    });

    newPost.save();
    res.redirect("/");
    
});

app.listen(3001, function () {
    console.log("server on 3001");

})