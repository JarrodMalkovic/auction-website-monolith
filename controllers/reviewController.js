const Review = require('../models/reviewModel');

exports.createReview = async (req, res, next) => {
  const { title, text, rating } = req.body;
  writtenBy = req.user.id;
  writtenFor = req.params.id;
  try {
    review = new Review({
      writtenBy,
      writtenFor,
      title,
      text,
      rating
    });

    await review.save();

    res.status(200).send(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getReviewById = async (req, res, next) => {
  try {
    console.log('this route');
    const review = await Review.findById(req.params.id);
    res.status(200).json({ review });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getReviewsForUserId = async (req, res, next) => {
  try {
    console.log('Sorting..');
    const reviews = await Review.find({ writtenFor: req.params.id }).sort({
      helpfulCount: -1
    });
    res.status(200).send(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getReviewsWrittenByUserId = async (req, res, next) => {
  try {
    const reviews = await Review.find({ writtenBy: req.user.id });
    res.status(200).send(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: 'There is no review by this ID' });
    }

    if (review.writtenBy.toString() === req.user.id) {
      await review.remove();
      return res.status(200).json(review);
    } else {
      return res
        .status(400)
        .json({ msg: "You cannot remove a listing you didn't create" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    console.log(review.writtenBy, req.user.id);
    if (review.writtenBy.toString() === req.user.id) {
      await review.updateOne(req.body);
      return res.status(200).json({ review });
    } else {
      return res
        .status(400)
        .json({ msg: "You cannot updating a review you didn't create" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.markReviewAsHelpful = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    console.log('review', review);
    const found = review.markedAsHelpful.some(el => el.user == req.user.id);
    if (!found) {
      review.markedAsHelpful.push({ user: req.user.id });
      review.helpfulCount = review.helpfulCount + 1;
    }
    // if (review.markedAsHelpful.indexOf(req.user.id) > -1) {
    //   console.log('Already marked as helpful');
    // } else {
    //   review.helpfulCount = review.helpfulCount + 1;
    //   review.markedAsHelpful = review.markedAsHelpful.push(req.user.id);
    // }
    // console.log('review', review);
    await review.save();
    console.log('review', review);

    res.status(200).json({ review });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
