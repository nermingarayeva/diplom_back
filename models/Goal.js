const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [200, 'Goal title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0.01, 'Target amount must be greater than 0'],
    set: function(value) {
      return Math.round(value * 100) / 100;
    }
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
    set: function(value) {
      return Math.round(value * 100) / 100;
    }
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Emergency Fund',
      'Vacation',
      'Car',
      'House',
      'Education',
      'Retirement',
      'Electronics',
      'Health',
      'Business',
      'Other'
    ],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  linkedAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  autoSaveAmount: {
    type: Number,
    default: 0,
    min: [0, 'Auto save amount cannot be negative']
  },
  autoSaveFrequency: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: function() {
      return this.autoSaveAmount > 0;
    }
  },
  color: {
    type: String,
    default: '#8B5CF6' // Default purple color
  },
  icon: {
    type: String,
    default: 'target'
  }
}, {
  timestamps: true
});

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  return Math.min(100, Math.round((this.currentAmount / this.targetAmount) * 100));
});

// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function() {
  return Math.max(0, this.targetAmount - this.currentAmount);
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const timeDiff = this.deadline.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual for required daily savings
goalSchema.virtual('requiredDailySavings').get(function() {
  const remaining = this.remainingAmount;
  const daysLeft = this.daysRemaining;
  return daysLeft > 0 ? Math.round((remaining / daysLeft) * 100) / 100 : 0;
});

// Virtual for goal status
goalSchema.virtual('status').get(function() {
    if (this.isCompleted) return 'completed';
    
    const daysLeft = this.daysRemaining;
    const progress = this.progressPercentage;
    
    if (daysLeft < 0) return 'overdue';
    if (daysLeft <= 30 && progress < 100) return 'urgent';
    
    return 'in progress';
  });
  