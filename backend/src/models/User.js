import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, minlength: 2, maxlength: 50 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: { type: String, required: true, minlength: 6, select: false }, // never returned by default
  },
  { timestamps: true }
);

// hash on create / password change only
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

/** Shape the frontend expects: { id, name, email } */
userSchema.set("toJSON", {
  transform: (_doc, ret) => ({ id: String(ret._id), name: ret.name, email: ret.email, createdAt: ret.createdAt }),
});

export default mongoose.model("User", userSchema);
