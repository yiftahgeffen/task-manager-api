const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1]
    const decode = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET)
    const user = await User.findOne ({ _id: decode._id, 'tokens.token': token })

    if (!user) {
      throw new Error()
    }
    req.token = token
    req.user = user
    next()
  }
  catch {
    res.status(401).send({error: ' please authenticate'})
  }

}

module.exports = auth