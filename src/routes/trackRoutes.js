const express = require('express');
const { model } = require('mongoose');
const { isCatchClause } = require('typescript');
const requireAuth = require('../middlewares/requireAuth');

const Track = model('Track');
const router = express.Router();
router.use(requireAuth); // make sure all the routes are accessed by authorized users only

router.get('/tracks', async (req, res) => {
  const userId = req.user._id;
  const tracks = await Track.find({ userId });
  res.send(tracks);
});

router.get('/tracks/:id', async (req, res) => {
  const id = req.params.id;
  const track = await Track.find({ _id: id });
  res.send(track);
});

router.post('/tracks', async (req, res) => {
  const userId = req.user._id;
  const { name, locations } = req.body;
  console.log('Received new track with name = ', name);
  if (!name || !locations) {
    return res.status(422).send({ error: 'Must provide name and locations' });
  }
  try {
    const track = new Track({ userId, name, locations });
    await track.save();
    res.send(track);
    console.log('Created Track ', track._id);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

module.exports = router;
