import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsite extends Document {
  name: string;
  domain: string;
  stars: number;
  expirationDate: string;
  city: string;
}

const WebsiteSchema: Schema = new Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true, unique: true },
  stars: { type: Number, required: true },
  expirationDate: { type: String, required: true },
  city: { type: String, required: true },
});

const Website = mongoose.model<IWebsite>('Website', WebsiteSchema);
export default Website;
