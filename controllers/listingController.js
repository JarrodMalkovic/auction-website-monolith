const Listing = require('../models/listingModel');

exports.createListing = async (req, res, next) => {
  try {
    const listingBody = { ...req.body, createdBy: req.user.id };
    const newListing = await Listing.create(listingBody);
    res.status(201).json({ listing: newListing });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};
exports.getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    res.status(200).json({ listing });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.getListingBySlug = async (req, res, next) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug }).populate(
      'createdBy'
    );
    res.status(200).json({ listing });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.getAllListings = async (req, res, next) => {
  try {
    let query = Listing.find({});

    // 1) Search by category (e.g Electronics, Pets, cars, etc)
    if (req.query.category) {
      query = Listing.find({ category: req.query.category });
    }

    // 2) Search by listing title (e.g 2004 Toyota Hyundi, Logitech G502, Sony Playstation 4)
    if (req.query.search) {
      let search = req.query.search.split('%20').join(' ');
      const RegEx = new RegExp(search);
      query = query.find({ title: { $regex: RegEx, $options: 'si' } });
    }

    // 3) Sorting
    if (req.query.sort) {
      let sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Listing must be active!
    query = query.find({ active: true }).populate('createdBy');

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    req.numListings = (await Listing.find(query)).length;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numListings = await Listing.countDocuments();
      if (skip >= numListings) {
        return res.status(500).send('Server Error');
      }
    }

    const listings = await query;
    req.listings = listings;

    next();
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
};

exports.endExpiredListings = async (req, res, next) => {
  try {
    let listings = req.listings;
    for (const listing of listings) {
      if (listing.endDate.getTime() < Date.now()) {
        listing.active = false;
        if (listing.bids.length > 0) {
          var winningBid = listing.bids.reduce((max, listing) =>
            max.bid > listing.bid ? max : listing
          );
        } else {
          var winningBid = null;
        }
        let winner;
        winningBid === null ? (winner = null) : (winner = winningBid.user);
        await Listing.update(
          { _id: listing._id },
          { $set: { active: false, winner: winner } }
        );
      }
    }
    listings = listings.filter(listing => listing.active);
    res.status(200).json({
      status: 'success',
      listings: listings.length,
      data: {
        listings
      },
      numListings: req.numListings
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
};

exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('createdBy');

    if (!listing) {
      return res.status(404).json({ msg: 'There is no listing by this ID' });
    }

    if (listing.createdBy._id.toString() === req.user.id) {
      await listing.remove();
      return res.status(200).json(listing);
    } else {
      return res
        .status(400)
        .json({ msg: "You cannot remove a listing you didn't create" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id).populate('createdBy');
    if (listing.createdBy._id.toString() === req.user.id) {
      let newListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json({ listing: newListing });
    } else {
      return res
        .status(400)
        .json({ msg: "You cannot updating a listing you didn't create" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.makeBid = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('createdBy');
    const maxBid = Math.max(...listing.bids.map(o => o.bid), 0);
    const bid = {
      user: req.user.id,
      bid: req.body.bid
    };
    if (req.body.bid > listing.minIncrement + maxBid) {
      listing.bids.push(bid);
      listing.currentPrice = req.body.bid;
      await listing.save();
      return res.status(200).json({ listing });
    } else {
      return res.status(400).json({ msg: "Your bid isn't high enough!" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.deleteBid = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.listing_id).populate(
      'createdBy'
    );

    listing.bids = listing.bids.filter(bid => {
      return bid._id != req.params.bid_id || bid.user.toString() != req.user.id;
    });
    const maxBid = Math.max(...listing.bids.map(o => o.bid), 0);
    listing.currentPrice = maxBid;
    await listing.save();
    return res.status(200).json(listing);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.endListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (listing.createdBy.toString() === req.user.id) {
      listing.active = false;
    } else {
      return res
        .status(400)
        .json({ msg: "You cannot end a listing that isn't yours!" });
    }
    await listing.save();
    return res.status(200).json(listing);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.getActiveListingsByUser = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      createdBy: req.params.user_id,
      active: true
    }).populate('createdBy');

    res.status(200).json({
      status: 'success',
      listings: listings.length,
      data: {
        listings
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.getInactiveListingsByUser = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      createdBy: req.params.user_id,
      active: false
    }).populate('createdBy');

    res.status(200).json({
      status: 'success',
      listings: listings.length,
      data: {
        listings
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.getUsersActiveListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      createdBy: req.user.id,
      active: true
    }).populate('createdBy');

    res.status(200).json({
      status: 'success',
      listings: listings.length,
      data: {
        listings
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};
exports.getUsersInactiveListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      createdBy: req.user.id,
      active: false
    }).populate('createdBy');

    res.status(200).json({
      status: 'success',
      listings: listings.length,
      data: {
        listings
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

exports.getUsersWonListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({
      winner: req.user.id,
      active: false
    }).populate('createdBy');

    res.status(200).json({
      status: 'success',
      listings: listings.length,
      data: {
        listings
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Internal Server Error, please try again' });
  }
};

// exports.uploadImage = async (req, res, next) => {
//   try {
//     const storage = multer.diskStorage({
//       filename: function(req, file, callback) {
//         callback(null, Date.now() + file.originalname);
//       }
//     });

//     const upload = multer({ storage: storage });
//     console.log(req.body.image);

//     cloudinary.v2.uploader.upload(req.body.image.path, function(err, result) {
//       if (err) {
//         res.json(err.message);
//       }
//       req.body.image = result.secure_url;

//       req.body.imageId = result.public_id;
//     });
//   } catch (err) {
//     res.json(err.message);
//   }
//   next();
// };
