const { Router } = require('express');
const {
  GetUserById,
  GetAllUser,
  CreateNewUser,
  UpdateUserById,
  DeleteUserById,
} = require('../controllers/user'); // Updated to 'transaction'
const upload = require('../middlewares/multer');

const router = Router();

router.get('/list', [], GetAllUser); // Updated to 'GetAllUser'
router.get('/:id', [], GetUserById); // Updated to 'GetUserById'
router.get('', [], GetAllUser); // Added route for GetTransactionByCode
router.post('/create', upload.fields([{ name: 'photo', maxCount: 1 }]), CreateNewUser); // Updated to 'CreateNewUser'
router.put('/update/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), UpdateUserById); // Updated to 'UpdateUserById'
router.delete('/delete/:id', [], DeleteUserById); // Updated to 'DeleteUserById'

module.exports = router;
