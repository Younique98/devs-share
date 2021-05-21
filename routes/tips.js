const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const DevTip = require('../models/DevTip')

// @desc    Show add page
// @route   GET /tips/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('tips/add')
})

// @desc    Process add form
// @route   POST /tips
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await DevTip.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all tips
// @route   GET /tips
router.get('/', ensureAuth, async (req, res) => {
  try {
    const tips = await DevTip.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('tips/index', {
      tips,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single DevTip
// @route   GET /tips/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let tip = await DevTip.findById(req.params.id).populate('user').lean()

    if (!tip) {
      return res.render('error/404')
    }

    if (tip.user._id != req.user.id && tip.status == 'private') {
      res.render('error/404')
    } else {
      res.render('tips/show', {
        tip,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /tips/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const tip = await DevTip.findOne({
      _id: req.params.id,
    }).lean()

    if (!tip) {
      return res.render('error/404')
    }

    if (tip.user != req.user.id) {
      res.redirect('/tips')
    } else {
      res.render('tips/edit', {
        tip,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update tip
// @route   PUT /tips/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let tip = await DevTip.findById(req.params.id).lean()

    if (!tip) {
      return res.render('error/404')
    }

    if (tip.user != req.user.id) {
      res.redirect('/tips')
    } else {
      tip = await tip.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete tip
// @route   DELETE /tips/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let tip = await DevTip.findById(req.params.id).lean()

    if (!tip) {
      return res.render('error/404')
    }

    if (tip.user != req.user.id) {
      res.redirect('/tips')
    } else {
      await tip.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User tips
// @route   GET /tips/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const tips = await DevTip.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('tips/index', {
      tips,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
