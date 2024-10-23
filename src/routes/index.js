const express = require('express');

const router = express.Router();
const AuthRouter = require('./auth');
const UserRouter = require('./user');
const MerchandiseRouter = require('./merchandise');
const ActivityRouter = require('./activity');
const TransactionRouter = require('./transaction');
const fileRouter = require('./file');
const CompetitionRouter = require('./competition');

router.get('/', (req, res) => {
  res.json({
    version: '3.9.0',
  });
});

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/merchandise', MerchandiseRouter);
router.use('/activity', ActivityRouter);
router.use('/transaction', TransactionRouter);
router.use('/file', fileRouter);
router.use('/competition', CompetitionRouter);

module.exports = router;
