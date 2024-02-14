const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;



//Task 6: 
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(400).json({message: "User already exists!"});    
    }
  } 
  return res.status(400).json({message: "Missing username or password"});
});

//Task 1:  Get the book list available in the shop
public_users.get('/',function (req, res) {
   res.send(JSON.stringify(books, null,  5));
});


//Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    const book = books[isbn];
    if (book) {
      res.send(JSON.stringify(book, null,  5));
    }
    else {
      res.send("Unable to find book");
    } 
 }
});
  
//Task3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  const author = req.params.author
  if (author) {
    const books_array = Object.values(books);
    const books_of_author = books_array.filter(book=>book.author === author)
    if (books_of_author.length > 0){
      res.send(JSON.stringify(books_of_author, null,  5));
    }
    else {
      res.send("Unable to find book");
    }
  }

});

//Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  if (title) {
    const books_array = Object.values(books);
    const books_of_title = books_array.filter(book=>book.title === title)
    if (books_of_title.length > 0){
      res.send(JSON.stringify(books_of_title[0], null,  5));
    }
    else {
      res.send("Unable to find book");
    }
  }
});

//Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    const book = books[isbn];
    if (book) {
      res.send(JSON.stringify(book.reviews, null,  5));
    }
    else {
      res.send("Unable to find book");
    } 
 }
});

/******************************************************************************************************************************************************
Note:
1) For tasks 10 to 13, I will create new endpoints to avoid modifying the original functions of tasks 1 to 4 and ensure they continue to work correctly.
2) It is not necessary to use axios when not making a call to an external API, therefore I will use only Promises and Async/Await.
*******************************************************************************************************************************************************/

// TASK 10 - Get the book list available in the shop using promises
public_users.get('/task10-books',function (req, res) {

  const get_books = new Promise((resolve, reject) => {
    try{
      resolve(res.send(JSON.stringify({books}, null, 5)));
    } catch (error) {
       reject(res.send(error.message))
    }  
  });

  get_books.then(() => console.log("Promise for  list of books resolved"))
           .catch(() => console.error('Promise for  list of books rejected '))
    
});


// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/task11-book/isbn/:isbn',function (req, res) {
  const get_book = new Promise((resolve, reject) => {
                        const isbn = req.params.isbn;
                        if (isbn) {
                                  if (books[isbn]) {
                                    resolve(res.send(JSON.stringify(books[isbn], null, 5)));
                                  }
                                  else {
                                    reject('Book not found')
                                  }     
                        }
                        else {
                              reject(res.send('ISBN not found'));
                        }
  });

  get_book.
      then(function(){
          console.log("Promise for get book by ISBN resolved");
      }).
      catch(function () { 
              console.log('Promise for get book by ISBN rejected');
});

});

// TASK 12  Get book details based on author using Async/Await
public_users.get('/task12-books/author/:author',function (req, res) {

  //Async function wraps return value in a promise 
  async function getBookByAuthor(req) {
    const author = req.params.author;
    if (author) {
      const books_array = Object.values(books);
      const books_of_author = books_array.filter(book=>book.author === author)
      if (books_of_author.length > 0){
        return books_of_author;
      }
      else {
        throw new Error('Books of author not found');
      } 
    } else {
      throw new Error('Author not found');
    }
  }
  
  //Call async function, await for result and send response 
  async function getBooks(req){
    try {
      const books = await getBookByISBN(req);
      res.send(JSON.stringify(books, null, 5))
    } catch (error) {
         res.send(error.message);
    }
  };

  getBooks(req);
});

// TASK 13  Get book details based on author using Async/Await
public_users.get('/task13-book/title/:title',function (req, res) {

  //Async function wraps return value in a promise 
  async function getBookByTitle(req) {
    const title = req.params.title;
    if (author) {
      const books_array = Object.values(books);
      const books_of_title = books_array.filter(book=>book.title === title)
      if (books_of_title.length > 0){
        return books_of_title;
      }
      else {
        throw new Error('Book of title not found');
      } 
    } else {
      throw new Error('Title not found');
    }
  }
  
  //Call async function, await for result and send response 
  async function getBooks(req){
    try {
      const books = await getBookByTitle(req);
      res.send(JSON.stringify(books, null, 5))
    } catch (error) {
         res.send(error.message);
    }
  };

  getBooks(req);

});

/****************************************************************/

module.exports.general = public_users;
