import mongoose from "mongoose"

const subscription_schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: [3, 'Subscription name must be at least 3 characters long'],
        maxLength: [100, 'Subscription name must be at most 100 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Subscription price cannot be negative']
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'education', 'gaming', 'other'],
    },
    payment_method: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    start_date: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date()
            },
            message: 'Start date cannot be in the future'
        }
    },
    renewal_date: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.start_date
            },
            message: 'Renewal date must be in the future'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {timestamps: true})

// * Auto-fill the renewal date
subscription_schema.pre('save', function (next) {
    if (!this.renewal_date) {
        const renewal_periods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }
        this.renewal_date = new Date(this.start_date)
        this.renewal_date.setDate(this.renewal_date.getDate() + renewal_periods[this.frequency])
    }
    // * Auto set the status based on the renewal date
    if (this.renewal_date < new Date()) {
        this.status = 'expired'
    }

    next()
})

const Subscription = mongoose.model('Subscription', subscription_schema)

export default Subscription