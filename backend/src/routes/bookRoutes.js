import express from "express";
import "dotenv/config";

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
    })
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", newBook });

  } catch (error) {
    console.log("Error adding book", error);
    res.status(500).json({ message: "Unable to add book", error });
  }
});
export default router;
