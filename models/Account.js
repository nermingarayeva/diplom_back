const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
    maxlength: [100, 'Account name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: true,
    enum: ['checking', 'savings', 'credit', 'investment'],
    default: 'checking'
  },
  balance: {
    type: Number,
    default: 0,
    set: function(value) {
      return Math.round(value * 100) / 100; // Round to 2 decimal places
    }
  },
  currency: {
    type: String,
    default: 'AZN',
    enum: ['AZN', 'USD', 'EUR']
  },
  bankName: {
    type: String,
    trim: true,
    maxlength: [100, 'Bank name cannot exceed 100 characters']
  },
  accountNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Account number cannot exceed 50 characters']
  },
  creditLimit: {
    type: Number,
    default: 0,
    validate: {
      validator: function(value) {
        return this.type !== 'credit' || value > 0;
      },
      message: 'Credit accounts must have a credit limit greater than 0'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#3B82F6' 
  }
}, {
  timestamps: true
});

accountSchema.virtual('availableBalance').get(function() {
  if (this.type === 'credit') {
    return this.creditLimit + this.balance; 
  }
  return this.balance;
});

module.exports = mongoose.model('Account', accountSchema);