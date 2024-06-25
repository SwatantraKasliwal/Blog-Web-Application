import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const userDataPath = __dirname + '/userData.json';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/home', (req, res) => {
    res.render('index.ejs');
})
app.get('/create', (req, res) => {
   res.render('createPost.ejs');
});

app.post('/submit', (req, res) => {
    const { title, topic, blog} = req.body;
    if (!title || !blog) {
        res.render('partials/failed.ejs');
    }else{
        const data = {
            title,
            topic,
            blog
        };
        const existingData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
        existingData.push(data);
        fs.writeFileSync('userData.json', JSON.stringify(existingData, null, 2));
        res.render('partials/success.ejs', {report : "uploaded"});
    }
});

app.get('/view', (req, res) => {
    const existingData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    res.render('viewPost.ejs', {userData: existingData});
});

app.get('/delete', (req, res) => {
    const existingData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    res.render('delete.ejs',{userData : existingData});
});

app.post('/submitDelete', (req, res) => {
    const {deletePost} = req.body;
    const existingData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    const indexToRemove = existingData.some(obj => obj.title === deletePost);
    console.log(indexToRemove);
    if (indexToRemove === true){
        const postToRemove = existingData.some(obj => obj.title === deletePost);
        existingData.splice(postToRemove,1);
        fs.writeFileSync('userData.json', JSON.stringify(existingData, null, 2));
        res.render("partials/success.ejs", {report : "deleted"});
    }
});

app.listen(port, () =>{
    console.log(`You are on the port ${port}`);
})