const { Router } = require('express');
const {
  GetMemberById,
  GetAllMembers,
  CreateNewMember,
  UpdateMemberById,
  DeleteMemberById,
} = require('../controllers/members');
const upload  = require('../middlewares/multer');

const router = Router();

router.get('', [], GetAllMembers);
router.get('/:id', [], GetMemberById);
router.post('', upload.fields([{ name: 'picture', maxCount: 1 }]), CreateNewMember);
router.put('/:id', upload.fields([{ name: 'picture', maxCount: 1 }]), UpdateMemberById);
router.delete('/:id', [], DeleteMemberById);

module.exports = router;
