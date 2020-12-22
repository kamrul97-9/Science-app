const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
//const mongoDB = require("mongodb");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

//connect to a new database called SciBlog
mongoose.connect("mongodb://localhost:27017/SciBlog",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//create a new postSchema that contains a title and content.
const PostSchema = ({
    title: String,
    content: String,
});

//create a new mongoose model using the schema to define my posts collection.
const Post = mongoose.model("Post", PostSchema)


const aboutContent = "The oldest classical Greek and Latin writing had little or no space between words and could be written in boustrophedon (alternating directions). Over time, text direction (left to right) became standardized, and word dividers and terminal punctuation became common.";
const contactContent = "In ancient manuscripts, another means to divide sentences into paragraphs was a line break (newline) followed by an initial at the beginning of the next paragraph. An initial is an oversized capital letter, sometimes outdented beyond the margin of the text.";


app.get("/", (req, res, next) =>{
    // res.render("home.ejs", {
    //     startingContent : homeStartinnContent,
    //     totalposts: posts,
    // });

    Post.find({}, (error, posts)=>{
        res.render("home", {
            //startingContent: homeStartinnContent,
            totalposts: posts
        });
    });

});

// app.get("/about", (req, res, next) =>{
//     res.render("about.ejs", {aboutContent : aboutContent });
// });

// app.get("/contact", (req, res, next) =>{
//     res.render("contact.ejs", {contactContent : contactContent});
// });

app.get("/compose",  (req, res, next) =>{
    res.render("compose.ejs");
});


app.post("/compose", function(req, res){
  //Inside the app.post() method for my /compose route,
  //create a new post document using my mongoose model.

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //need to add a call back to the mongoose save() method.
    post.save(function(error){
    if (!error){
        res.redirect("/");
    }
 });
  });

  //you should change the express route parameter to postId instead of postTitle
app.get('/posts/:postId', (req, res, next)=>{
    const requestedPostId = req.params.postId;
    // posts.forEach(function(post){
    //     const storedTitle = _.lowerCase(post.title);

    //     if( reqeustedTitle === storedTitle){
    //         res.render('post.ejs', {
    //             title: post.title,
    //             content: post.content
    //         });
    //     }
    // });

    //Once a matching post is found, I can render its title and content in the post.ejs page.
    Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("post", {
          title: post.title,
          content: post.content
        });
      });
});

const Port = 3010;
app.listen(Port, () =>{
    console.log(`This blog server is running on https://localhost:${Port}`);

})
