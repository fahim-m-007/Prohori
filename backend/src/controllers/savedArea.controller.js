const mongoose = require("mongoose");
const SavedArea = require("../models/SavedArea");

function serializeSavedArea(area) {
  return {
    id: area._id.toString(),
    _id: area._id.toString(),
    name: area.name,
    category: area.category || "residential",
    thana: area.thana,
    address: area.address,
    position:
      Array.isArray(area.position) && area.position.length === 2
        ? area.position
        : [23.8103, 90.4125],
    note: area.note || "",
    createdAt: area.createdAt,
    updatedAt: area.updatedAt,
  };
}

// @desc    Get all saved areas for the logged in user
// @route   GET /api/saved-areas
// @access  Private
exports.getSavedAreas = async (req, res, next) => {
  try {
    const areas = await SavedArea.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({
      success: true,
      data: {
        savedAreas: areas.map(serializeSavedArea),
      },
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new saved area
// @route   POST /api/saved-areas
// @access  Private
exports.createSavedArea = async (req, res, next) => {
  try {
    const { name, category, thana, address, position, note } = req.body;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Location name is required." });
    }
    if (!thana || !thana.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Thana is required." });
    }
    if (!address || !address.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Address or landmark is required." });
    }

    let resolvedPosition = [23.8103, 90.4125];
    if (
      Array.isArray(position) &&
      position.length === 2 &&
      !isNaN(position[0]) &&
      !isNaN(position[1])
    ) {
      resolvedPosition = [Number(position[0]), Number(position[1])];
    }

    const savedArea = await SavedArea.create({
      user: req.user._id,
      name: name.trim(),
      category: category || "residential",
      thana: thana.trim(),
      address: address.trim(),
      position: resolvedPosition,
      note: note ? note.trim() : "",
    });

    return res.status(201).json({
      success: true,
      data: {
        savedArea: serializeSavedArea(savedArea),
      },
      message: "Location saved successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update a saved area
// @route   PATCH /api/saved-areas/:id
// @access  Private
exports.updateSavedArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid saved area ID." });
    }

    const savedArea = await SavedArea.findById(id);
    if (!savedArea) {
      return res
        .status(404)
        .json({ success: false, message: "Saved area not found." });
    }

    if (savedArea.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this saved area.",
      });
    }

    const { name, category, thana, address, position, note } = req.body;
    if (name !== undefined) savedArea.name = name.trim();
    if (category !== undefined) savedArea.category = category;
    if (thana !== undefined) savedArea.thana = thana.trim();
    if (address !== undefined) savedArea.address = address.trim();
    if (
      Array.isArray(position) &&
      position.length === 2 &&
      !isNaN(position[0]) &&
      !isNaN(position[1])
    ) {
      savedArea.position = [Number(position[0]), Number(position[1])];
    }
    if (note !== undefined) savedArea.note = note.trim();

    await savedArea.save();

    return res.json({
      success: true,
      data: {
        savedArea: serializeSavedArea(savedArea),
      },
      message: "Saved area updated.",
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete a saved area
// @route   DELETE /api/saved-areas/:id
// @access  Private
exports.deleteSavedArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid saved area ID." });
    }

    const savedArea = await SavedArea.findById(id);
    if (!savedArea) {
      return res
        .status(404)
        .json({ success: false, message: "Saved area not found." });
    }

    if (savedArea.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this saved area.",
      });
    }

    await SavedArea.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Saved area removed.",
    });
  } catch (error) {
    return next(error);
  }
};
