const { Router } = require('express');
const {
  GetActivityById,
  GetAllActivities,
  CreateNewActivity,
  UpdateActivityById,
  DeleteActivityById,
} = require('../controllers/activity');
const upload  = require('../middlewares/multer');

const router = Router();

router.get('', [], GetAllActivities);
router.get('/:id', [], GetActivityById);
router.post('', upload.fields([{ name: 'imageActivity', maxCount: 1 }]), CreateNewActivity);
router.put('/:id', upload.fields([{ name: 'imageActivity', maxCount: 1 }]), UpdateActivityById);
router.delete('/:id', [], DeleteActivityById);

module.exports = router;
