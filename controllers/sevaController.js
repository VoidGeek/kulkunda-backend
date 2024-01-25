const { asyncErrHandler } = require('../middleware/asyncerrorHandler');
const Seva = require('../models/sevaModel');
const { errorHandler } = require('../Utils/errorHandler');

// Create a TTL index on the sevadate field (expiration time is set to 0 seconds for immediate deletion after sevadate)
Seva.collection.createIndex({ sevadate: 1 }, { expireAfterSeconds: 0 });

exports.getSevas = asyncErrHandler(async (req, res, next) => {
  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return next(errorHandler(403, 'You are not authorized to access this resource'));
  }

  try {
    const sevas = await Seva.find();
    res.status(200).json({ success: true, sevas });
  } catch (error) {
    next(errorHandler(500, 'Error fetching Seva records'));
  }
});

exports.createSeva = async (req, res) => {
  const { sevaname, username, phonenumber, sevadate, userId, rashi, nakshatra, gotra } = req.body;

  // Check if all required fields are present
  if (!sevaname || !username || !phonenumber || !sevadate || !userId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create a new Seva document with sevadate as a Date type
  const newSeva = await Seva.create({
    sevaname,
    username,
    phonenumber,
    sevadate: new Date(sevadate),
    userId,
    rashi,
    nakshatra,
    gotra,
  });

  res.status(200).json({ message: 'Form submitted successfully', success: true, newSeva });
};

// Update the Seva document
exports.updateSeva = async (req, res) => {
  const { id } = req.params;
  const { sevaName, name, dateOfSeva } = req.body;

  try {
    const updatedSeva = await Seva.findByIdAndUpdate(id, { sevaName, name, dateOfSeva }, { new: true });

    if (!updatedSeva) {
      res.status(404).json({ error: 'Seva not found' });
    } else {
      res.json(updatedSeva);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete the Seva document
exports.deleteSeva = asyncErrHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You are not authorized to delete sevas' });
  }

  const { sevaId } = req.params;

  try {
    const deletedSeva = await Seva.findByIdAndDelete(sevaId);

    if (!deletedSeva) {
      return res.status(404).json({ error: 'Seva not found' });
    }

    res.status(200).json({ success: true, message: 'Seva deleted successfully' });
  } catch (error) {
    console.error('Error deleting seva:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

exports.numberOfSevas = asyncErrHandler(async (req, res, next) => {
  const length = await Seva.countDocuments();
  const sevas = await Seva.find();

  if (!length) {
    return next(errorHandler(403, 'There are no sevas in the database'));
  }

  res.status(200).json({ message: 'Num of users:', length, sevas });
});

exports.getSingleSeva = asyncErrHandler(async (req, res, next) => {
  const { id } = req.body;
  const seva = await Seva.findById(id);

  if (!seva) {
    return next(errorHandler(404, 'Seva not found'));
  }

  res.status(200).json({ message: 'Seva found successfully', seva });
});

exports.getSevaByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const sevas = await Seva.find({ userId });

    if (sevas.length > 0) {
      res.status(200).json({ message: 'Sevas found successfully', sevas });
    } else {
      return next(errorHandler(404, 'Sevas not found for the given user'));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
