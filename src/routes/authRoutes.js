const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

// interface AuthInterface {
//   email: string;
//   password: number;
// }

const router = express.Router();

router.post('/signup', async (req, res) => {
  console.log('POST /signup');
  const { email, password } = req.body;
  const user = new User({ email, password });
  try {
    await user.save(); // c'est ici que le User est enregistré dans MongoDB
    const token = jwt.sign({ userId: user._id }, process.env.SECRET);
    res.send({ token });
    console.log('Created User ', email);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  console.log('POST /signin');
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).send({ error: 'must provide email and password' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).send({ error: 'email not found' });
    return;
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, process.env.SECRET);
    res.send({ token });
    console.log('User has signed in ', email);
  } catch (err) {
    res.status(401).send({ error: 'invalid password' });
    return;
  }
});
module.exports = router;
