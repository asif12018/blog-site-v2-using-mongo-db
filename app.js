//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var posts = [];

//1.create a data base
mongoose.connect('mongodb+srv://asifrequest:123456789Asif@cluster0.p6zhmfc.mongodb.net/blogDB');
//2.create a schema
const postsSchema ={
  title:String,
  post:String
};
//3.create new model
const Post = mongoose.model('Post',
postsSchema
);
//4.create sample data
const post1 = new Post({
  title:'Day 01',
  post:'this is just a text post'
});

//inserting data to array
posts.push(post1);
//inserting to data base
Post.insertMany(posts);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


app.get('/', function(req,res){
   Post.find({})
   .then((foundPosts)=>{
    if(foundPosts.length === 0){
      res.redirect('/');
    }else{
      res.render('home',{content:homeStartingContent, posts:foundPosts});
    }
   })
});

app.get('/about', function(req,res){
  res.render('about',{aboutContent:aboutContent});
});

app.get('/contact', function(req,res){
  res.render('contact', {contactContent:contactContent});
});

app.get('/compose',function(req,res){
  res.render('compose');
});

app.post('/compose', function(req,res){
  const post = new Post({
    title: req.body.contentTitle,
    post: req.body.content
  });
  post.save();
  res.redirect('/')
});

app.get('/post/:postName',function(req,res){
  var requestedTitle = _.lowerCase(req.params.postName);
  // console.log(req.params);
  Post.find({})
  .then((foundPosts)=>{
    for(let foundPost of foundPosts){
      const storedTitle =  _.lowerCase(foundPost.title);
      if(storedTitle === requestedTitle){
        res.render('post',
      {
        title: foundPost.title,
        post: foundPost.post,
        id: foundPost._id
      });
      }
    }
  })
  
});

//delete from database
app.post('/delete',function(req,res){
  const postId = req.body.submit;
  Post.findByIdAndDelete(postId)
  .then(deletedPost =>{
    if(!deletedPost){
      console.log('no porduct found with that ID');
    }else{
      console.log('Product deleted:', deletedPost)
    }
  })
  .catch(err => {
    console.error('Error deleting product:', err);
});
res.redirect('/');
})

