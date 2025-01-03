const express = require('express')
const router = express.Router()
const Blogging = require('../modals/blogging-modal')
const ErrorHandler = require('../utils/ErrorHandler')
const axios = require('axios');

// create
async function CreateBlog(req, res) {
  let body = req.body
  try {
    let newBlog = await Blogging.create(body)
    res.status(200).json({ message: 'Blog Created', data: newBlog })
  } catch (err) {
    res.status(418).json({ message: 'Invalid Data', data: null, error: err })
  }
}

async function GetAllBlogs(req, res) {
  let reqQuery = { ...req.query }
  try {
    // method 1 for filter
    let blog = await Blogging.find(reqQuery)
    res.status(200).json({ message: 'Blog', data: blog })
  } catch (err) {
    res.status(418).json({ message: 'No Tours Found', data: null, error: err })
  }
}

async function GetInOrderData(req, res) {
  let reqQuery = { ...req.query, isPublished: false || null }
  try {
    // method 1 for filter
    let blog = await Blogging.findOne(reqQuery)
    res.status(200).json({ message: 'Blog', data: blog })
  } catch (err) {
    res.status(418).json({ message: 'No Tours Found', data: null, error: err })
  }
}

async function UpdateIsPublished(req, res) {
  const id = req.params.id
  try {
    let blog = await Blogging.findByIdAndUpdate(
      id,
      { $set: { isPublished: false } }, // Set the new value for isPublished
      { new: true } // Return the updated document
    )
    if (!blog) return res.status(404).json({ message: 'Blog not found', data: null })
    res.status(200).json({ message: 'Blog updated successfully', data: blog })
  } catch (err) {
    res.status(500).json({ message: 'Error updating blog', data: null, error: err })
  }
}

// delete
async function DeleteBlog(req, res) {
  const id = req.params.id
  try {
    const deletedBlog = await Blogging.findByIdAndDelete(id)
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found', data: null })
    res.status(200).json({ message: 'Blog Deleted', data: deletedBlog })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', data: null, error: err })
  }
}

async function AddPostToBLog(req, res) {
  let reqQuery = { ...req.query }
  try {
    // method 1 for filter
    let blog = await Blogging.findOne(reqQuery)

    let payload = {
      kind: 'blogger#post',
      blog: { id: '8070105920543249955' },
      title: blog.postTitle,
      content: blog.blogPost,
    }
    
    // Send post request to Blogger API
    const response = await axios.post(
      'https://www.googleapis.com/blogger/v3/blogs/8070105920543249955/posts/',
      payload,
      {
        headers: {
          Authorization: `Bearer ${'110183634560-skcsgkdaaqkopl5241gb6bvttda1k255.apps.googleusercontent.com'}`,
        },
      }
    );

    res.status(200).json({ message: 'Blog', data: blog })
  } catch (err) {
    res.status(418).json({ message: 'No Tours Found', data: null, error: err })
  }
}

router.route('').post(CreateBlog).get(GetAllBlogs)
router.route('/order').get(GetInOrderData)
router.route('/:id').delete(DeleteBlog)
router.route('/isPublished/:id').patch(UpdateIsPublished)
router.route('/blog').post(AddPostToBLog)
module.exports = router
