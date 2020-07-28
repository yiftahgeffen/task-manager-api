// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id.id)
// console.log(id)
// console.log(id.toHexString())
// console.log(Object.prototype.toString.call(id));
// console.log(Object.prototype.toString.call(id.toHexString()));

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to DB - ' + error)
  }
  const db = client.db(databaseName)

  // db.collection('tasks').insertMany ([{
  //   description: 'take the trash',
  //   completed: true
  // }, {
  //   description: 'wash dishes',
  //   completed: false
  // }, {
  //   description: 'walk the dog',
  //   completed: true
  // }], (error, result) => {
  //     if (error) {
  //       return console.log('Unable to insert to DB - ' + error)
  //     }
  //     console.log(result.ops)
  // })
  // db.collection('users').insertMany([{
  //   name: 'bil',
  //   age: 12
  // },{
  //   name: 'mike',
  //   age: 54
  // }], (error, result) => {
  //     if (error) {
  //       return console.log('Unable to insert to DB - ' + error)
  //     }
  //     console.log(result.insertedCount)
  // })

  db.collection('users').insertOne({
    name: 'yiftah',
    age: 34
  }, (error, result) => {
    if (error) {
      return console.log('Unable to insert to DB - ' + error)
    }
    console.log(result.ops)
  })
  // db.collection('tasks').findOne({_id: new ObjectID("5ec791ff99b60d2fd7e996f3")} , (error,user) => {
  //     if (error) {
  //       return console.log('Unable to insert to DB - ' + error)
  //     }
  //     // console.log(user)
  // })
  //
  // db.collection('tasks').find({completed: true} ).toArray( (error, users)=> {
  //   console.log(users)
  // })
  // db.collection('users').updateOne( {
  //   _id: new ObjectID("5ec78d22b1c24a2f46857281")
  // }, {
  //   $set: {
  //     name: 'moshe_1'
  //   }
  // }).then( (resolve) => {
  //   console.log(resolve.modifiedCount)
  // }).catch ( (error) => {
  //   console.log(error)
  // })

  // db.collection('users').updateMany( {
  // }, {
  //   $inc: {age: 1}
  // }).then( (resolve) => {
  //   console.log(resolve.modifiedCount)
  // }).catch ( (error) => {
  //   console.log(error)
  // })
  //
  // db.collection('tasks').updateMany( {
  //   completed: false }, {
  //   $set: { completed: true }
  // }).then( (resolve) => {
  //   console.log(resolve.modifiedCount)
  // }).catch ( (error) => {
  //   console.log(error)
  // })

  // db.collection('users').deleteOne(
  //   {name: 'yiftah_3'}).then ((resolve) => {
  //   console.log(resolve)}
  // ).catch ( (error) => {
  // console.log(error)
  //   })
  db.collection('users').deleteMany(
    {name: 'yiftah'}).then ((resolve) => {
    console.log(resolve)}
  ).catch ( (error) => {
    console.log(error)
  })

})
