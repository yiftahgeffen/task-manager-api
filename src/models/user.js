const mongoose = require ('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
      require: true,
      trim: true
  },
  email: {
    type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('not a valide email')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
      validate (value) {
      if (value<0)
        throw new Error('Age must be positive number!')
    }
  },
  password: {
    required: true,
    type: String,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.includes('password'))
        throw new Error('password cant contain the string password!')
    }
  },
  tokens: [{
    token: {
      type: String,
      require: true
    }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual(
    'tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON  = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.tokens
    delete userObject.password
    delete userObject.avatar

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({_id: user.id.toString()}, process.env.JSON_WEB_TOKEN_SECRET)
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email,password) => {
  const user = await User.findOne({email})
  if (!user) {
    throw new Error('unable to login')
    // throw new Error ('no user found')
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw new Error('unable to login')
    //we will NOT provide the exact reason why things failed form security reasons
    // throw new Error('wrong password was entered')
  }
  return user
}

//hash the plain text password befor saving
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password =  await bcrypt.hash(user.password, 8)
  }

  next ()
})


//delete the tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})

    next()

})

const User = mongoose.model ('Users', userSchema )

module.exports = User