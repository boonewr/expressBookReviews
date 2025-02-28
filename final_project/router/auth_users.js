const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password
  });
  if (validusers.length >= 1) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username

    }
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(300).json({ message: "Login unsuccessful" + JSON.stringify(users) });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  let book = Object.values(books).find((book) => book["isbn"] === isbn);
  if (book) {
    book["reviews"][req.session.authorization.username] = review;
    return res.status(200).json({ message: "Review added successfully" });
  } else {
    return res.status(404).json({ message: "Book not found", isbn: isbn, books: JSON.stringify(books), type: " " + typeof isbn });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  let book = Object.values(books).find((book) => book["isbn"] === isbn);
  if (book) {

    for (let i = 0; i < book["reviews"].length; i++) {
      if (book["reviews"][i] === req.session.authorization.username) {
        book["reviews"].splice(i, 1);
      }
    }

    book["reviews"][req.session.authorization.username] = "";
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Book not found", isbn: isbn, books: JSON.stringify(books), type: " " + typeof isbn });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
