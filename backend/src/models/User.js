import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    //validator to validate email
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email" + value);
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profileImage: {
    type: String,
    default: "",
  },
});

//hashing password beforing saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//password authentication
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};


const User = mongoose.model("User", userSchema);

export default User;
