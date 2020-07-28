const express = require('express')
const userRouter = express.Router()
const User = require('../models/user.js')
const mongoose = require('../db/mongoose.js')
const auth = require('../middleware/authentication.js')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account.js')

userRouter.post ('/users', async (req,res) => {
  const user = new User(req.body)
    try {
      sendWelcomeEmail(user.email, user.name)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({user, token})
  } catch (error) {
    res.status(400).send(error)
  }
  // user.save().then ( (result) => {
  //   res.status(201).send(user)
  // }).catch ((error) => {
  //   res.status(400).send(error)
  // })
})

userRouter.post ('/users/login', async (req,res) => {
  try {
    const user = await User.findByCredentials (req.body.email, req.body.password)
    const token = await user.generateAuthToken()

    res.status(200).send({ user, token })
    // res.status(200).send({ user: user.getPublicProfile(), token })
  }
  catch (error) {
    res.status(400).send(error)
    // res.status(400).send(error.message)
  }
})

userRouter.post ('/users/logout', auth, async (req, res) => {
  try {
    const user = req.user
    user.tokens = user.tokens.filter (token => token.token !== req.token)
    await req.user.save()
    res.status(200).send()
  }
  catch (error) {
    res.status(400).send(error)
  }
})

userRouter.post ('/users/logoutAll', auth, async (req, res) => {
  try {
    console.log(req.user)
    req.user.tokens = []
    await req.user.save()
    res.status(200).send()
  }
  catch (error) {
    res.status(400)
  }
})

userRouter.get('/users/me',auth, async (req,res) => {
  res.status(200).send(req.user)
})

userRouter.get('/users',auth, async (req,res) => {
  // User.find({name: 'yiftah_1'}, (err,user) => {
  //   res.send(user)
  // })
  try {
    const users = await User.find({})
    res.status(200).send(users)
  } catch (error) {
    res.status(500).send(error)
  }
  // User.find({}).then ( (result) => {
  //   res.status(200).send(result)
  // }).catch ( (error) => {
  //   res.status(500).send(error)
  // })
})

// userRouter.get('/users/:id', async (req,res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).send('_id is not valid')
//   }
//   try {
//     const user = await User.findById(req.params.id)
//     if (!user) {
//       return res.status(404).send()
//     }
//     res.status(200).send(user)
//   } catch (error) {
//     res.status(500).send(error)
//   }
// })

// (req,res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).send('_id is not valid')
//   }
//   User.findById(req.params.id).then ( (result) => {
//     if (!result) {
//       return res.status(404).send()
//     }
//     res.status(200).send(result)
//   }).catch ( (error) => {
//     res.status(500).send(error)
//   })


userRouter.patch('/users/me', auth, async (req,res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age' ]
  const isValideOperation = updates.every( (update) => allowedUpdates.includes(update) )

  if (!isValideOperation) {
    return res.status(400).send({error: 'Invalid update'})
  }

  try {
    updates.forEach((update) => req.user[update]=req.body[update] )

    await req.user.save()
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})

    res.status(200).send(req.user)
  } catch (error) {
    res.status(500).send(error)
  }
})

userRouter.delete ('/user/me' , auth, async (req,res) => {

    try {
    // const user = await User.findByIdAndRemove(req.user._id )
    // if (!user) {
    //   return res.status(404).send()
    // }
    await req.user.remove()
    sendCancellationEmail(req.user.email, req.user.name)
    res.status(200).send(req.user)
  }
  catch (error) {
    res.status(500).send(error)
  }
})

const upload = multer({
    //dest: 'avatar',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!(file.originalname.match(/\.(jpg|jpeg|png)$/))) {
            return cb(new Error('please upload a Word doc'))
             
        }
        return cb(undefined, true)
    }
})

userRouter.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
    
}, (error, req, res, next) => {
        res.status(400).send({ error : error.message })
})


userRouter.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

userRouter.get('/users/:id/avatar', async (req, res) => {  
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error('no user or no avatar')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch (e) {
        res.status(404).send(e)
    }
})

module.exports = userRouter