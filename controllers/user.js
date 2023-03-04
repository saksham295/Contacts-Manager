import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ token: token });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).json({ msg: "All input is required" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.status(200).json({ token: token });
    } else {
      res.status(400).json({ msg: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.contacts.sort(
      (a, b) => a.contactName - b.contactName || a.contactPhone - b.contactPhone
    );
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};

const findContact = (user, phone) => {
  return new Promise(async (resolve, reject) => {
    await user.contacts.forEach((contact) => {
      if (contact.contactPhone === phone) {
        return resolve(contact);
      }
    });
    return resolve(false);
  });
};

const getContactIndex = (user, id) => {
  return new Promise(async (resolve, reject) => {
    await user.contacts.forEach((contact, i) => {
      if (contact._id.toString() === id) {
        return resolve(i);
      }
    });
    return resolve(false);
  });
};

export const addContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { contactName, contactPhone, contactEmail, contactAddress } =
      req.body;

    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldContact = await findContact(user, contactPhone);
    if (oldContact) {
      return res.status(400).json({ message: "Contact already exists" });
    }

    user.contacts.push({
      contactName: contactName,
      contactPhone: contactPhone,
      contactEmail: contactEmail,
      contactAddress: contactAddress,
    });

    await user.save();
    res.status(200).json(user.contacts[user.contacts.length - 1]);
  } catch (error) {
    console.log(error);
  }
};

export const editContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id, newName, newPhone, newEmail, newAddress } = req.body;

    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldContact = await findContact(user, newPhone);
    if (oldContact) {
      return res.status(400).json({ message: "Contact already exists" });
    }

    const contactIndex = await getContactIndex(user, id);
    if (contactIndex === false) {
      return res.status(404).json({ message: "Contact does not exist" });
    }

    user.contacts[contactIndex].contactName = newName;
    user.contacts[contactIndex].contactPhone = newPhone;
    user.contacts[contactIndex].contactEmail = newEmail;
    user.contacts[contactIndex].contactAddress = newAddress;

    await user.save();
    res.status(200).json(user.contacts[contactIndex]);
  } catch (error) {
    console.log(error);
  }
};

export const deleteContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { contactPhone } = req.body;

    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldContact = await findContact(user, contactPhone);
    if (!oldContact) {
      return res.status(404).json({ message: "Contact does not exist" });
    }

    user.contacts = user.contacts.filter((contact) => {
      return contact._id !== oldContact._id;
    });
    await user.save();
    res.status(200).send("Contact deleted successfully");
  } catch (error) {
    console.log(error);
  }
};
