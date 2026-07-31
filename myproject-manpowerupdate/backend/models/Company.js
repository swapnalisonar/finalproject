const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Manpower Recruitment', trim: true },
    tagline: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    mapEmbedUrl: { type: String, default: '', trim: true },
    ownerName: { type: String, default: '', trim: true },
    ownerTitle: { type: String, default: '', trim: true },
    ownerBio: { type: String, default: '', trim: true },
    ownerPhotoUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

companySchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('Company', companySchema);
