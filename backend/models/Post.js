import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['happening', 'event', 'news'],
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Internship', 'Project', 'Startup', 'Registration', ''],
      default: '',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dateTime: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Happenings are auto-approved; events/news need approval
postSchema.pre('save', function (next) {
  if (this.type === 'happening') {
    this.status = 'approved';
  }
  next();
});

export default mongoose.model('Post', postSchema);
