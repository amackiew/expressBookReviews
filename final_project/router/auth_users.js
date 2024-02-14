const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{return user.username === username});
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


//Task 7:
const authenticatedUser = (username,password)=>{ //returns boolean

  //write code to check if username and password match the one we have in records.

let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} 
else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(400).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {accessToken,username}
    return res.status(200).send("User successfully logged in");
  } 
  else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

//Task 8:  Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization["username"]; 
  const isbn = req.params.isbn;
  const review = {"review":req.query.review};
  if (isbn) {
    const book = books[isbn];
    if (book) {
      books[isbn].reviews[username] = review;
      //Return the book with reviews for testing purpose.
      res.send(JSON.stringify(books[isbn], null,  5));  
    }
    else {
      res.send("Unable to find book");
    } 
 }
});

//Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const username = req.session.authorization["username"]; 
  const isbn = req.params.isbn;
  const review = {"review":req.query.review};
  if (isbn) {
    const book = books[isbn];
    if (book) {
      delete books[isbn].reviews[username];
      //Return the book with reviews for testing purpose.
      res.send(JSON.stringify(books[isbn], null,  5));  
    }
    else {
      res.send("Unable to find book");
    } 
 }

});  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
