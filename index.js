const express = require("express")
const app = express()

const {initializeDatabase} = require("./db/db.connect");
const Books = require("./models/book.model");
const { get } = require("mongoose");

app.use(express.json())


initializeDatabase();


app.get("/", (req, res) => {
  res.send("Mohd Rafi")
})


async function createMovie(newBook){
  try {
      const book = new Books(newBook);
      const saveBook = await book.save();
      return saveBook
  } catch (error) {
      throw error
  }
}

app.post("/books", async (req, res) => {
  try {
      const saveBook = await createMovie(req.body);
      res.status(201).json({message: "Books added successfully", book: saveBook})
  } catch (error) {
     res.status(500).json({error: "Failed to add Books"})
  }
});

// get all books from database

async function readBookByAll(){
  try {
    const allBook = await Books.find();
    return allBook
  } catch (error) {
    throw error
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await readBookByAll()
    if(books.length != 0){
      res.json(books)
    }else{
      res.status(404).json({error: "No movies found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch book"})
  }
})

// get books by title from database

async function readBooksByTitle(bookTitle){
  try {
    const bookByTitle = await Books.find({title : bookTitle})
    return bookByTitle
  } catch (error) {
    throw error
  }
}

app.get("/books/:bookTitle", async (req, res) => {
  try {
    const book = await readBooksByTitle(req.params.bookTitle);
    if(book){
      res.json(book)
    }else{
      res.status(404).json({error: "Book not found."})
    }
  } catch (error) {
    res.status(500).json({error: "failed to fetch book."})
  }
})

// get book by author from database

async function readBookByAuthor(bookauth){
  try {
    const bookByAuthor = await Books.find({author : bookauth});
    return bookByAuthor
  } catch (error) {
    throw error
  }
}

app.get("/books/bookAuthor/:author", async (req, res) => {
  try {
    const book = await readBookByAuthor(req.params.author);
    if(book){
      res.json(book);
    }else{
      res.status(404).json({error: "Book not found."})
    }
  } catch (error) {
    res.status(500).json({error: "failed to fetch book"})
  }
})

// get book by genre from database

async function readBookByGenre(bookGenre){
  try {
    const bookByGenre = await Books.find({genre: bookGenre})
    return bookByGenre
  } catch (error) {
    throw error
  }
}

app.get("/books/bookGenre/:genre", async (req, res) => {
  try {
    const book = await readBookByGenre(req.params.genre);
    if(book){
      res.json(book)
    }else{
      res.status(404).json({error : "Book not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch book"})
  }
})

// get book by released year

async function readBookByYear(releaseYear){
  try {
    const bookByYear = await Books.find({publishedYear: releaseYear});
    return bookByYear
  } catch (error) {
    throw error
  }
}

app.get("/books/year/:publishedYear", async (req, res) => {
  try {
    const book = await readBookByYear(req.params.publishedYear);
    if(book){
      res.json(book)
    }else{
      res.status(404).json({error: "Book not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch book"})
  }
})


//update book rating by Id
async function updateBookRating(bookName, updateToData){
  try {
    const bookRating = await Books.findByIdAndUpdate(bookName, updateToData, {new : true})
    return bookRating
  } catch (error) {
    console.log("Error in updating book rating.", error)
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updateBook = await updateBookRating(req.params.bookId, req.body)
    if(updateBook){
      res.status(200).json({message: "Book update successfully."})
    }else{
      res.status(404).json({error : "Book does not exist."})
    }
  } catch (error) {
    res.status(500).json({error: "failed to update book"})
  }
})


// update book rating by its title
async function updateBookRatingByTitle(bookTitle, dataToUpdate){
  try {
    const updateRatingByTitle = await Books.findOneAndUpdate({title : bookTitle}, dataToUpdate, {new:true});
    return updateRatingByTitle
  } catch (error) {
    console.log("Error in updating book rating.", error)
  }
}

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updateBook = await updateBookRatingByTitle(req.params.bookTitle, req.body);
    if(updateBook){
     res.status(200).json({message: "Book update successfully."})
    }else{
      res.status(404).json({error: "Book does not exist"})
    }
  } catch (error) {
    res.status(500).json({error: "failed to update book"})
  }
})


// Delete a book by Id
async function readBookByDeleteById(bookId){
  try {
    const deleteBook = await Books.findByIdAndDelete(bookId);
    return deleteBook
  } catch (error) {
    console.log("Error in delete a book.")
  }
}
app.delete("/books/:bookId", async (req, res) => {
  try {
    const book = await readBookByDeleteById(req.params.bookId);
    if(book){
      res.status(200).json({message:"Book delete successfully"})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to delete book."})
  }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})