const mongoose = require ('mongoose')

mongoose.connect(process.env.MONGOOSE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

// console.log(validator.isEmail('jhgsadf@'))

// const me = new User ({
//   name: 'yiftah',
//   email: '  jygsdf@gmie.com',
//   password: '   asodda'
// })
// me.save().then ( (result) => {
//   console.log(result)
// }).catch ((error) => {
//   console.log(error)
// })


// const Task = mongoose.model( 'Task', {
//   description: {
//     required: true,
//     type: String,
//     trim: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   }
// })
//
// const meTask = new Task( {
//   description: 'finish launch'
// }).save().then ((result) => {
//   console.log(result)
// }).catch( (error) => {
//   console.log(error)
// })

module.exports = mongoose