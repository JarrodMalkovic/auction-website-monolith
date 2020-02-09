const Report = require('../models/reportModel');

exports.createReport = async (req, res, next) => {
  const { reason, reportedRef } = req.body;
  reportedBy = req.user.id;
  reported = req.params.id;
  try {
    report = new Report({
      reportedBy,
      reported,
      reason,
      reportedRef
    });

    await report.save();

    res.status(200).send(report);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('reported reportedBy');
    res.status(200).json({ reports });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
