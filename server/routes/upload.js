const express = require("express");
const MediaFile = require("../modals/MediaFile"); // Assuming you have your MediaFile model defined
const { Config } = require("../config");

const UploadRoute = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    // Initialize an array to store the file IDs
    const fileIds = [];

    // Loop over all files in req.files
    for (let fileKey in req.files) {
      const uploadedFile = req.files[fileKey];

      // Generate a unique filename
      const uniqueFileName = Date.now() + "-" + uploadedFile.name;

      // Save the file to the /uploads folder
      const uploadPath = Config.BASE_DIR + "/uploads/" + uniqueFileName;
      await uploadedFile.mv(uploadPath);

      // Save file information to the MediaFile model
      const mediaFile = new MediaFile({
        filename: uploadedFile.name,
        filesize: uploadedFile.size,
        path: uniqueFileName,
        visitcount: 0,
        username: req.body.username,
        PrintType:req.body.PrintType,
      });

      let f = await mediaFile.save();

      // Add the file ID to the fileIds array
      fileIds.push(f._id);
    }

    res.json({ fileIds: fileIds });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).send("An error occurred while uploading the files.");
  }
};

module.exports = UploadRoute;