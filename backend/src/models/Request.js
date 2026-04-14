import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    category: String,
    description: {
      type: String,
      required: true,
    },
    address: String,
    pincode: String,
    status: {
      type: String,
      default: 'Submitted',
    },
    paymentStatus: {
      type: String,
      default: null,
    },
    requiresPayment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Request', requestSchema);
