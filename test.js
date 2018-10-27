const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');

// Lets start app
const app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use( express.static(path.join(__dirname, 'public')));


// Set storage engine

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb)=>{
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
})

// Init upload

app.use(express.static(path.join(__dirname, 'public')));
const upload = multer({
    storage: storage,
    limits:{fileSize:10000000},
    fileFilter: (req, file, cb)=>{
        checkFileType(file, cb);
    }
}).single('myFile')

app.use(express.static(path.join(__dirname, 'public')));
function checkFileType(file, cb) {
    //allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // check extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }
    else{
        cb('Error: Images only');
    }
}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res)=>{
    res.render("index");
});

app.post('/uploads', (req, res)=>{
    upload(req, res, (err)=>{
        if(err){
            res.render('index', {
                msg: err
            })
        }
        else {
            console.log(req.file);
            if(req.file== undefined){
                res.render('index', {msg: "ERROR: No file Uploaded"})
            }
            else{
                res.render('index', {msg: "Upload Successful", img: `uploads/${req.file.filename}`})
            }
        }
    })
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log(`Server is running on the PORT ${PORT}`)
})
