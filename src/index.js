const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

const app = express()
app.use(express.json())
const port = process.env.PORT

app.use(userRouter)
app.use(taskRouter)

app.listen( port, () => {
  console.log('server is up on port ' + port)
})

//const Task = require('../src/models/task')
//const User = require('../src/models/user')

//const main = async () => {
//    const task = await Task.findById('5f0c6044c7a0c10794c35941')
    //await task.populate('owner').execPopulate();
    //console.log(task.owner)

    //const user = await User.findById('5f0adcd95215dc21c81dff16')
    //await user.populate('task').execPopulate()
    //console.log(user.tasks)
//}

//main()
//
// const pet = {
//   name: 'mosh'
// }
// pet.toJSON=  () => 'hi there'
//
// console.log(JSON.stringify(pet))

//const multer = require('multer')

//const upload = multer({
//    dest:'images'
//})

//app.post('/upload', upload.single('upload'), (req, res) => {
//        res.send()
//})