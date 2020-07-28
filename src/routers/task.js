const express = require('express')
const taskRouter = express.Router()
const Task = require('../models/task.js')
const mongoose = require('../db/mongoose.js')
const auth = require('../middleware/authentication.js')

taskRouter.post('/task', auth, async (req, res) => {

    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user.id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
    // task.save().then (() => {
    //   res.status(201).send(task)
    // }).catch((error) => {
    //   res.status(400).send(error)
    // })
})


//GET /tasks?completed=true
//GET /tasks?limit=2&skip=3
//GET /tasks?sortBy=createdAt:-1

taskRouter.get('/tasks', auth, async (req, res) => {
    // Task.find({name: 'yiftah_1'}, (err,task) => {
    //   res.send(task)
    // })
    //Task.find({}).then((tasks) => {
    //    res.status(200).send(tasks)
    //}).catch((error) => {
    //    res.status(500).send(error)
    //})
    try {
        //const tasks = await Task.find({
        //    owner: req.user._id})
        const sort = {}
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        const match = {}
        if (req.query.completed)
            match.completed = req.query.completed === 'true'

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    }
    catch (e) {
        res.status(500).send({ error: e.message })
    }

})

taskRouter.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send('_id is not valid')
    }
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        return res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
    //Task.findById(_id).then ( (result) => {
    //  if (!result) {
    //    return res.status(404).send()
    //  }
    //  res.status(200).send(result)
    //}).catch  (error)
    //{
    //  res.status(500).send(error)
    //}
})

taskRouter.patch('/task/:id', auth, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('_id is not valid')
    }
    const validUpdates = ['completed', 'description']
    const updates = Object.keys(req.body)
    const isValidUpdate = updates.every((update) => validUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update' })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true } )
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

taskRouter.delete('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = taskRouter