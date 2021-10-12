const express = require('express');
const { model } = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = model('Track');
const router = express.Router();
router.use(requireAuth); // make sure all the routes are accessed by authorized users only
router.get('/tracks', async (req, res) => {
  const userId = req.user._id;
  const tracks = await Track.find({ userId });
  res.send(tracks);
});

module.exports = router;
