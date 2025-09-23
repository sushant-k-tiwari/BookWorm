import express from "express";
import "dotenv/config";
import protectRoute from "../middleware/auth.middleware.js";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, author, caption, rating, image } = req.body;

    if (!image || !title || !author || !caption || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;
    //save to db
    const newBook = new Book({
      title,
      author,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", newBook });
  } catch (error) {
    console.log("Error adding book", error);
    res.status(500).json({ message: "Unable to add book", error });
  }
});

//pagination and infinite scrolling
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = 5;

    const books = await Book.find()
      .sort({ createdAt: -1 }) // descending order
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error fetching books", error);
    res.status(500).json({ message: "Unable to fetch books", error });
  }
});

//get all user recomendations
router.get("/user", protectRoute, async (req, res) => {
  try {
  } catch (error) {
    console.log("Error fetching user books", error);
    res.status(500).json({ message: "Unable to fetch user books", error });
  }
});

//get all user recomendations
router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.findById({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.log("Error fetching user books", error);
    res.status(500).json({ message: "Unable to fetch user books", error });
  }
});

//deleting a book
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    //check if the user is the owner of the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this book" });
    }

    //delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        //abnkdancsn.png
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error deleting image from cloudinary", error);
      }
    }
    await book.deleteOne();
    res.status(200).json({
      message: "Book deleted successfully!",
    });
  } catch (error) {
    console.log("Error deleting book", error);
    res.status(500).json({ message: "Unable to delete book", error });
  }
});
export default router;
