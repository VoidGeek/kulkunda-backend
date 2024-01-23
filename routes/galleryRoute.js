const express = require('express');
const { uploadimage, noofimg, deleteimg,getAllImages,getSingleImage } = require('../controllers/gallerycontroller');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middleware/Authenticated');

router.post("/admin/upload", isAuthenticated, authorizeRoles('admin'), uploadimage)
router.get("/noofimg", isAuthenticated, noofimg)
router.get('/allimages', getAllImages); // New route to get all images
router.get('/getsingleimage/:id', getSingleImage);
router.delete("/admin/delete/:id", isAuthenticated, authorizeRoles('admin'), deleteimg)
module.exports = router;
