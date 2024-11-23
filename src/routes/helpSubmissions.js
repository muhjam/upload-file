const { Router } = require('express');
const {
  GetHelpSubmissionById,
  GetAllHelpSubmissions,
  CreateNewHelpSubmission,
  UpdateHelpSubmissionById,
  DeleteHelpSubmissionById,
} = require('../controllers/helpSubmissions');
const upload  = require('../middlewares/multer');

const router = Router();

router.get('', [], GetAllHelpSubmissions);
router.get('/:id', [], GetHelpSubmissionById);
router.post('', upload.fields([{ name: 'file', maxCount: 1 }]), CreateNewHelpSubmission);
router.put('/:id', upload.fields([{ name: 'file', maxCount: 1 }]), UpdateHelpSubmissionById);
router.delete('/:id', [], DeleteHelpSubmissionById);

module.exports = router;
