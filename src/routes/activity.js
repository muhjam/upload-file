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

router.get('/list', [], GetAllActivities);
router.get('/:id', [], GetActivityById);
router.post('/create', upload.fields([{ name: 'imageActivity', maxCount: 1 }]), CreateNewActivity);
router.put('/update/:id', upload.fields([{ name: 'imageActivity', maxCount: 1 }]), UpdateActivityById);
router.delete('/delete/:id', [], DeleteActivityById);

module.exports = router;
