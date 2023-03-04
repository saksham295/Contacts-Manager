import express from "express";
import {
  register,
  login,
  addContact,
  editContact,
  deleteContact,
  getUser,
} from "../controllers/user.js";
import verifyToken from "../middleware/auth.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First name is required").trim().not().isEmpty(),
    check("email", "Include a valid email").trim().isEmail(),
    check("password", "Password should be alteast 6 character").isLength({
      min: 6,
    }),
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "E-mail Address Required").trim().isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

router.get("/getUser", verifyToken, getUser);

router.post(
  "/addContact",
  [
    verifyToken,
    [
      check("contactName", "Name is required").trim().not().isEmpty(),
      check("contactPhone", "10 digit mobile number required")
        .trim()
        .isNumeric()
        .isLength(10),
      check("contactEmail", "Include a valid email")
        .trim()
        .isEmail()
        .optional({ nullable: true, checkFalsy: true }),
    ],
  ],
  addContact
);

router.post(
  "/editContact",
  [
    verifyToken,
    [
      check("newName", "Name is required").trim().not().isEmpty(),
      check("newPhone", "10 digit mobile number required")
        .trim()
        .isNumeric()
        .isLength(10),
      check("newEmail", "Include a valid email")
        .trim()
        .isEmail()
        .optional({ nullable: true, checkFalsy: true }),
    ],
  ],
  editContact
);

router.post(
  "/deleteContact",
  [
    verifyToken,
    [
      check("contactPhone", "10 digit mobile number required")
        .trim()
        .isNumeric()
        .isLength(10),
    ],
  ],
  deleteContact
);

export default router;
