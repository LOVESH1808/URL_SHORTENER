const mongoose = require('mongoose');

const linkSchema = mongoose.Schema(
  {
    name : {type : String, required : true},
    
    longUrl: { type: String, required: true },

    shortUrl: { type: String, required: true, unique: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    clicks: { type: Number, default: 0 },

    analytics: {
      type: [
        {
          timestamp: { type: Date, default: Date.now },
          ip: String,
          device: String,
          browser: String,
        }
      ],
      default: [],
    },

    expiresAt: { 
      type: Date, 
      required: true, 
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      index: { expires: 0 } // TTL index to auto-delete
    },
  },
  {
    timestamps: true,
  }
);

const Links = mongoose.model("Links", linkSchema);

module.exports = Links;
