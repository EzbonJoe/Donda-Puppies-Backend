const Puppy = require('../models/PuppyModel.js');
const cloudinary = require('../config/cloudinary');

// @desc    Create a new puppy
// @route   POST /api/puppies
// @access  Admin
const createPuppy = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => file.path) : [];
    const imagesPublicIds = req.files ? req.files.map(file => file.filename) : [];
    const newPuppy = new Puppy({ ...req.body, images, imagesPublicIds });
    const savedPuppy = await newPuppy.save();

    res.status(201).json(savedPuppy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all puppies (optionally filter by availability)
// @route   GET /api/puppies
// @access  Public
const getPuppies = async (req, res) => {
  try {
    const { available } = req.query; // ?available=true
    const filter = available === "true" ? { isAvailable: true } : {};
    const puppies = await Puppy.find(filter).sort({ createdAt: -1 });
    res.json(puppies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single puppy by ID
// @route   GET /api/puppies/:id
// @access  Public
const getPuppyById = async (req, res) => {
  try {
    const puppy = await Puppy.findById(req.params.id);
    if (!puppy) return res.status(404).json({ message: "Puppy not found" });
    res.json(puppy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update puppy
// @route   PUT /api/puppies/:id
// @access  Admin

// Update Puppy with new images
// const updatePuppy = async (req, res) => {
//   try {
//     const images = req.files && req.files.length > 0
//       ? req.files.map(file => `/uploads/${file.filename}`)
//       : undefined;

//     const updateData = {
//       ...req.body,
//       ageInWeeks: req.body.ageInWeeks ? Number(req.body.ageInWeeks) : undefined,
//       priceCents: req.body.priceCents ? Number(req.body.priceCents) : undefined,
//       isAvailable: req.body.isAvailable !== undefined
//         ? req.body.isAvailable === "true"
//         : undefined,
//       vaccinated: req.body.vaccinated !== undefined
//         ? req.body.vaccinated === "true"
//         : undefined,
//       dewormed: req.body.dewormed !== undefined
//         ? req.body.dewormed === "true"
//         : undefined,
//       trained: req.body.trained !== undefined
//         ? req.body.trained === "true"
//         : undefined,
//       bestSeller: req.body.bestSeller !== undefined
//         ? req.body.bestSeller === "true"
//         : undefined
//     };

//     if (req.body.name) updateData.name = req.body.name;
//     if (req.body.description) updateData.description = req.body.description;
//     if (req.body.breed) updateData.breed = req.body.breed;
//     if (req.body.ageInWeeks) updateData.ageInWeeks = Number(req.body.ageInWeeks);
//     if (req.body.priceCents) updateData.priceCents = Number(req.body.priceCents);
//     if (req.body.gender) updateData.gender = req.body.gender;

//     ['isAvailable','vaccinated','dewormed','trained','bestSeller'].forEach(field => {
//       if (req.body[field] !== undefined) updateData[field] = req.body[field] === "true";
//     });

//     if (images) updateData.images = images;

//     const updatedPuppy = await Puppy.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedPuppy) {
//       return res.status(404).json({ message: "Puppy not found" });
//     }

//     res.json(updatedPuppy);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const updatePuppy = async (req, res) => {
  try {
    const puppy = await Puppy.findById(req.params.id);
    if (!puppy) return res.status(404).json({ message: 'Puppy not found' });

    // Build the updateData object
    const updateData = {
      ...req.body,
      ageInWeeks: req.body.ageInWeeks ? Number(req.body.ageInWeeks) : puppy.ageInWeeks,
      priceCents: req.body.priceCents ? Number(req.body.priceCents) : puppy.priceCents,
      isAvailable: req.body.isAvailable !== undefined
        ? req.body.isAvailable === "true"
        : puppy.isAvailable,
      vaccinated: req.body.vaccinated !== undefined
        ? req.body.vaccinated === "true"
        : puppy.vaccinated,
      dewormed: req.body.dewormed !== undefined
        ? req.body.dewormed === "true"
        : puppy.dewormed,
      trained: req.body.trained !== undefined
        ? req.body.trained === "true"
        : puppy.trained,
      bestSeller: req.body.bestSeller !== undefined
        ? req.body.bestSeller === "true"
        : puppy.bestSeller,
      name: req.body.name || puppy.name,
      description: req.body.description || puppy.description,
      breed: req.body.breed || puppy.breed,
      gender: req.body.gender || puppy.gender,
    };

    // ✅ Handle new images uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (puppy.imagesPublicIds && puppy.imagesPublicIds.length > 0) {
        for (const publicId of puppy.imagesPublicIds) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Save new images and publicIds
      updateData.images = req.files.map(file => file.path);
      updateData.imagesPublicIds = req.files.map(file => file.filename);
    }

    const updatedPuppy = await Puppy.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedPuppy);

  } catch (error) {
    console.error('Error updating puppy:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Delete puppy
// @route   DELETE /api/puppies/:id
// @access  Admin
const deletePuppy = async (req, res) => {
  try {
    const deleted = await Puppy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Puppy not found" });

    // Delete images from Cloudinary
    if (deleted.imagesPublicIds && deleted.imagesPublicIds.length > 0) {
      for (const publicId of deleted.imagesPublicIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    res.json({ message: "Puppy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deletePuppy,
  updatePuppy,
  getPuppyById,
  getPuppies,
  createPuppy
}
