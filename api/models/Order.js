const mongoose = require('mongoose');
const { Schema,model } = mongoose;
const uuid=require('uuid')

const FeedbackSchema = new Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.ObjectId,
    ref: 'Product',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000,
  },
//   images: [
//     {
//       type: String,
//       required: true,
//     },
//   ],
  is_flagged: {
    type: Boolean,
    default: false,
  },
  flag_reason: {
  type: String,
  enum: ['inappropriate', 'spam', 'offensive', 'product_quality', 'delivery_time', 'customer_service', 'not_satisfied_product'],
  default: null
}
}, { timestamps: true });

const OrderSchema = new Schema({
  order_id: {
    type: String,
    default: ()=> uuid.v4().replace(/-/g,'').slice(0,5)
  },
  customer: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    weight:{
        type:Number,
        required:true
    },
    weight_units:{
        type:String,
        required:true
    },
    price: {
      type: Number,
      required: true
    },
    feedback:FeedbackSchema,
    feedback_given:{
        type:Boolean,
        default:false
    }
  }],
  status: {
    type: String,
    enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
//   shipping_address: {
//     type: mongoose.ObjectId,
//     ref:'Address',
//     required: true
//   },
  shipping_address:{
    type:String,
    required:true
  },
  total_amount: {
    type: Number,
    required: true
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  delivery_date: {
    type: Date
  },
  cancellation_date: {
    type: Date
  },
  reason_for_cancellation: {
    type: String
  }
});

OrderSchema.path('items.feedback').required(false)

module.exports = model('Order', OrderSchema);

// const Order = require('./models/Order');

// Order.findOne({ order_id: 'your_order_id' })
//   .populate('items.product_id')
//   .exec((err, order) => {
//     if (err) {
//       console.log('Error occurred while populating products: ', err);
//     } else {
//       console.log('Order with populated products: ', order);
//     }
//   });