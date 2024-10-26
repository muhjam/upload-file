const { Router } = require('express');
const {
  GetUserById,
  GetAllUser,
  CreateNewUser,
  UpdateUserById,
  DeleteUserById,
} = require('../controllers/users'); // Updated to 'transaction'
const upload = require('../middlewares/multer');

const router = Router();

router.get('', [], GetAllUser); // Updated to 'GetAllUser'
router.get('/:id', [], GetUserById); // Updated to 'GetUserById'
router.get('', [], GetAllUser); // Added route for GetTransactionByCode
router.post('', upload.fields([{ name: 'photo', maxCount: 1 }]), CreateNewUser); // Updated to 'CreateNewUser'
router.put('/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), UpdateUserById); // Updated to 'UpdateUserById'
router.delete('/:id', [], DeleteUserById); // Updated to 'DeleteUserById'

module.exports = router;
