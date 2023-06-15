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
  let listPromise = new Promise((resolve, reject) => {
    resolve(books);
    reject("Error getting books");
  });

  listPromise.then((books) => {
    return res.status(200).json(books);
  }).catch((err) => {
    return res.status(404).json({ message: "Error getting books" });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  let isbnPromise = new Promise((resolve, reject) => {
    let book = Object.values(books).find((book) => book["isbn"] === isbn);
    if (book) {
      resolve(book);
    }
    reject("Book not found");
  });

  isbnPromise.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json({ message: "Book not found", isbn: isbn });
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;

  let authorPromise = new Promise((resolve, reject) => {
    let book = Object.values(books).find((book) => book["author"] === author);
    resolve(book);
    reject("Book not found");
  });
  
  authorPromise.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json({ message: "Book not found", author: author });
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;

  let titlePromise = new Promise((resolve, reject) => {
    let book = Object.values(books).find((book) => book["title"] === title);
    resolve(book);
    reject("Book not found");
  });
  
  titlePromise.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json({ message: "Book not found", title: title });
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  let reviewPromise = new Promise((resolve, reject) => {
    let book = Object.values(books).find((book) => book["isbn"] === isbn);
    resolve(book);
    reject("Book not found");
  });

  reviewPromise.then((book) => {
    return res.status(200).json(book["reviews"]);
  }).catch((err) => {
    return res.status(404).json({ message: "Book not found", isbn: isbn });
  });
});

module.exports.general = public_users;
