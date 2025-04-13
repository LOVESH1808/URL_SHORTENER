const express = require('express');
const expressAsyncHandler = require("express-async-handler");
const shortID = require("shortid");
const Links = require("../models/linkModel");
const shortid = require("shortid");
const extractBrowser = require("../util/extractBrowser");

const generateShortURL = expressAsyncHandler(async (req, res) => {
  const { url, name } = req.body;
  if (!url || !name) {
    return res.status(400).json({ message: "URL and name is required" });
  }
  const shortID = shortid.generate();

  try {
    const link = await Links.create({
      name : name,
      longUrl: url,
      shortUrl: shortID,
      createdBy: req.user._id,
      clicks: 0,
      analytics: [],
    });
    if (!link) {
      return res.status(500).json({ message: "Error creating URL" });
    }
    res.status(201).json({
      message: "Short URL created successfully",
      data: {
        name : link.name,
        shortUrl: `${link.shortUrl}`,
        createdBy: req.user._id,
        longUrl: link.longUrl,
        expiresAt: link.expiresAt,
      },
    });
  } catch (Error) {
    console.log(Error.message);
    res.status(500);
  }
});

const getAllLinks = expressAsyncHandler(async (req, res) => {
  try {
    const links = await Links.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    }); // latest first

    res.status(200).json({
      message: "Links fetched successfully",
      data: links,
    });
  } catch (error) {
    console.error("Error fetching links:", error.message);
    res.status(500).json({ message: "No urls created yet" });
  }
});

const getShortURL = expressAsyncHandler(async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const link = await Links.findOne({ shortUrl });

    if (!link) {
      return res.status(404).send("Link not found");
    }

    // Check expiry
    if (link.expiresAt && link.expiresAt < new Date()) {
      return res.status(410).send("Link has expired");
    }

    link.clicks += 1;

    link.analytics.push({
      timestamp: new Date(),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      device: req.get("user-agent"),
      browser: extractBrowser(req.get("user-agent")),
    });

    await link.save();

    return res.redirect(301, link.longUrl);
  } catch (err) {
    console.error("Redirect error:", err.message);
    res.status(500).send("Server error");
  }
});

const deleteShortURL = expressAsyncHandler(async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const link = await Links.findOne({ shortUrl });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (link.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await link.deleteOne();

    res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (Error) {
    res.status(500).json({
      message: "Error deleting the short URL , please try again later",
    });
  }
});

const getAnalytics = expressAsyncHandler(async (req, res) => {
  const { shortUrl } = req.params;

  try {
    
    const link = await Links.findOne({ shortUrl: shortUrl });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (link.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to access this link's analytics",
        });
    }

    res.status(200).json({expiresOn: link.expiresAt, longUrl : link.longUrl, shortUrl : link.shortUrl, analytics : link.analytics, clicks : link.clicks});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching analytics", error: error.message });
  }
});

module.exports = {
  generateShortURL,
  getAllLinks,
  deleteShortURL,
  getAnalytics,
  getShortURL,
};
