const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      return true;
    }
  }
  return false;
};


public_users.post("/register", (req, res) => {
  const username= req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // let bookList = [];
  // Object.values(books).forEach((book) => {
  //   if (book["isbn"]) {
  //     bookList.push("\'" + book["title"] + "\' by " + book["author"] + ", ISBN: " + book["isbn"]);
  //   } else {
  //     bookList.push("\'" + book["title"] + "\' by " + book["author"]);
  //   }
  // });
  // return res.status(200).json({bookList});
  // return res.status(200).json({ message: "Book list" + JSON.stringify(books) });
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let book = Object.values(books).find((book) => book["isbn"] === isbn);
  if (book) {
    return res.status(200).json({ message: "Book found" + JSON.stringify(book) });
  }
  return res.status(404).json({ message: "Book not found", isbn: isbn });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let book = Object.values(books).find((book) => book["author"] === author);
  if (book) {
    return res.status(200).json({ message: "Book found" + JSON.stringify(book) });
  } else {
    return res.status(404).json({ message: "Book not found", author: author });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  let book = Object.values(books).find((book) => book["title"] === title);
  if (book) {
    return res.status(200).json({ message: "Book found" + JSON.stringify(book) });
  } else {
    return res.status(404).json({ message: "Book not found", title: title });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let book = Object.values(books).find((book) => book["isbn"] === isbn);
  if (book) {
    return res.status(200).json({ message: "Book found" + JSON.stringify(book["reviews"]) });
  } else {
    return res.status(404).json({ message: "Book not found", isbn: isbn });
  }
});

module.exports.general = public_users;
