const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true,
    maxlength: [100, 'Budget name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount must be positive'],
    set: value => Math.round(value * 100) / 100
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative'],
    set: value => Math.round(value * 100) / 100
  },
  period: {
    type: String,
    required: true,
    enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  alertThreshold: {
    type: Number,
    min: [0, 'Alert threshold must be positive'],
    max: [100, 'Alert threshold cannot exceed 100%'],
    default: 80
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#10B981'
  },
  includeSubcategories: [{
    type: String,
    trim: true
  }],
  excludeSubcategories: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Virtual fields
budgetSchema.virtual('remaining').get(function() {
  return Math.max(0, this.amount - this.spent);
});

budgetSchema.virtual('percentageSpent').get(function() {
  return this.amount > 0 ? Math.round((this.spent / this.amount) * 100) : 0;
});

budgetSchema.virtual('status').get(function() {
  const percentage = this.percentageSpent;
  if (percentage >= 100) return 'exceeded';
  if (percentage >= this.alertThreshold) return 'warning';
  return 'on-track';
});

// Indexes
budgetSchema.index({ userId: 1, period: 1 });
budgetSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
