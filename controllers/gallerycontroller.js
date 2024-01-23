const { asyncErrHandler } = require('../middleware/asyncerrorHandler');
const Gallery = require('../models/gallerymodel');
const { errorHandler } = require('../Utils/errorHandler');

exports.uploadimage = asyncErrHandler(async (req, res, next) => {
    const gallery = await Gallery.create(req.body);
    if (!gallery) {
        return next(errorHandler(400, "Failed to upload images"));
    }
    res.status(200).json({ message: "Images uploaded successfully", success: true, gallery });
});

exports.noofimg = asyncErrHandler(async (req, res, next) => {
    const length = await Gallery.countDocuments();
    const gallery = await Gallery.find();
    if (!length) {
        return next(errorHandler(403, "There are no Images in the database"));
    }
    res.status(200).json({ message: "Num of Images:", length, gallery });
});

exports.getAllImages = asyncErrHandler(async (req, res, next) => {
    const gallery = await Gallery.find();
    res.status(200).json({ success: true, message: "All images retrieved successfully", gallery });
});

exports.getSingleImage = asyncErrHandler(async (req, res, next) => {
    const imageId = req.params.id;
    const image = await Gallery.findById(imageId);

    if (!image) {
        return next(errorHandler(404, "Image not found"));
    }

    res.status(200).json({ success: true, message: "Image retrieved successfully", image });
});

exports.deleteimg = async (req, res, next) => {
    let image = await Gallery.findById(req.params.id);
    if (!image) {
        return next(404, "Image not found");
    }

    await Gallery.findByIdAndDelete(req.params.id).then(() => {
        res.status(200).json({ success: true, message: "Image deleted successfully" });
    });
};
