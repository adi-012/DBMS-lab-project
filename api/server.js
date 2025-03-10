const express=require('express')
const colors=require('colors')
const dotenv=require('dotenv')
const morgan=require('morgan')
const session=require('express-session')
const passport=require('passport')

const authRoutes=require('./routes/authRoutes');
const orderRoutes=require('./routes/orderRoutes');
const brandRoutes=require('./routes/brandRoutes')
const categoryRoutes=require('./routes/categoryRoutes');
const productRoutes=require('./routes/productRoutes');


const mongoose = require('mongoose');
const cors=require('cors')
const app=express()


dotenv.config();
require('./config/passport')(passport)


console.log(process.env.url)
const connect = mongoose.connect(process.env.url,{useNewUrlParser: true}, { useUnifiedTopology: true },  {useCreateIndex: true});
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


//middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors({credentials:true,origin:'http://localhost:3000'}))

// Sessions
app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: false
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

//routes
app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/categories',categoryRoutes)
app.use('/api/brands',brandRoutes)


const PORT=process.env.PORT||5000;
const development=process.env.DEV_MODE;
app.listen(PORT,()=>{
    console.log(`Server running on ${development} mode on port ${PORT}`.bgCyan.white);
})


//now I have to show in orders that product is deleted if a product is deleted. Order should exist. 

//stripe secret key: sk_test_51N81SASH9kRgRQHTXYRSIFadrQWy691oIlyTNlZ9goa4PGsl3HSSxXrGZsp8qF4lPoSbXuHw384MyWjjoccqKk4y00QO7dZWCP

//colgate max fresh spicy : price_1N81VKSH9kRgRQHTKSY8iqae
//pepsodent : price_1N81WqSH9kRgRQHTmQkf8ymD
//colgate fresh mint: price_1N81YESH9kRgRQHTbOBmybax

