// queries.js
// MongoDB Queries for PLP Bookstore
// Use in MongoDB Shell or within Node.js

use("plp_bookstore");

// ---------------------
// 🔹 BASIC CRUD QUERIES
// ---------------------

// 1️⃣ Find all books in a specific genre
db.books.find({ genre: "Fiction" });

// 2️⃣ Find books published after a certain year
db.books.find({ published_year: { $gt: 1950 } });

// 3️⃣ Find books by a specific author
db.books.find({ author: "George Orwell" });

// 4️⃣ Update the price of a specific book
db.books.updateOne({ title: "1984" }, { $set: { price: 13.5 } });

// 5️⃣ Delete a book by its title
db.books.deleteOne({ title: "Moby Dick" });


// ----------------------
// 🔹 ADVANCED OPERATIONS
// ----------------------

// 6️⃣ Find books that are in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// 7️⃣ Projection – show only title, author, and price
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

// 8️⃣ Sort books by price (ascending)
db.books.find().sort({ price: 1 });

// 9️⃣ Sort books by price (descending)
db.books.find().sort({ price: -1 });

// 🔟 Pagination (5 books per page)
// Page 1
db.books.find().limit(5);
// Page 2
db.books.find().skip(5).limit(5);


// ----------------------
// 🔹 AGGREGATION PIPELINES
// ----------------------

// 1️⃣ Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", average_price: { $avg: "$price" } } }
]);

// 2️⃣ Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", total_books: { $sum: 1 } } },
  { $sort: { total_books: -1 } },
  { $limit: 1 }
]);

// 3️⃣ Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: {
        decade: {
          $concat: [
            { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
            "s"
          ]
        }
      },
      count: { $sum: 1 }
    }
  },
  { $project: { _id: 0, decade: "$_id.decade", count: 1 } },
  { $sort: { decade: 1 } }
]);


// ----------------------
// 🔹 INDEXING
// ----------------------

// 1️⃣ Create index on title for faster search
db.books.createIndex({ title: 1 });

// 2️⃣ Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 3️⃣ Demonstrate performance improvement using explain()
db.books.find({ title: "The Hobbit" }).explain("executionStats");
