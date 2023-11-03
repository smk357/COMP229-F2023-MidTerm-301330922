// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let Book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  Book.find((err, books) => {
    if (err) {
      return console.error(err);
    } else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });
});

// GET the Book Details page for adding a new Book
router.get('/add', (req, res, next) => {
  res.render('books/details', {
    title: 'Add a New Book',
    book: { Title: '', Description: '', Price: 0, Author: '', Genre: '' }
  });
});

// POST process the Book Details page and create a new Book
router.post('/add', (req, res, next) => {
  const newBookData = {
    Title: req.body.title,
    Description: req.body.description,
    Price: req.body.price,
    Author: req.body.author,
    Genre: req.body.genre
  };

  Book.create(newBookData, (err, book) => {
    if (err) {
      return console.error(err);
    }
    res.redirect('/books');
  });
});

// GET the Book Details page for both viewing and editing an existing Book
router.get('/:id', (req, res, next) => {
  const bookId = req.params.id;

  // Use the Book model to find the book by ID
  Book.findById(bookId, (err, book) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error finding the book.');
    }

    // Render the "details" view and pass the book data
    res.render('books/details', {
      title: 'Book Details',
      book: book,
    });
  });
});

// POST process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  const bookId = req.params.id;
  
  // Use the values from the form fields to update the book
  const updatedBookData = {
    Title: req.body.title,
    Description: req.body.description,
    Price: req.body.price,
    Author: req.body.author,
    Genre: req.body.genre
  };

  // Update the book using findByIdAndUpdate
  Book.findByIdAndUpdate(bookId, updatedBookData, { new: true, upsert: true }, (err, book) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating the book.');
    }

    // Redirect to the book details page after the update
    res.redirect('/books/');
  });
});




// GET process the delete by book _id
router.get('/delete/:id', (req, res, next) => {
  const bookId = req.params.id;

  Book.findByIdAndRemove(bookId, (err, book) => {
    if (err) {
      return console.error(err);
    }
    res.redirect('/books');
  });
});

module.exports = router;
