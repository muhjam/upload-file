const { Router } = require('express');
const {
  GetTransactionById,
  GetTransactionByCode, // Added this line
  GetAllTransaction,
  CreateNewTransaction,
  UpdateTransactionById,
  DeleteTransactionById,
} = require('../controllers/transaction'); // Updated to 'transaction'
const upload = require('../middlewares/multer');

const router = Router();

router.get('/list', [], GetAllTransaction); // Updated to 'GetAllTransaction'
router.get('/:id', [], GetTransactionById); // Updated to 'GetTransactionById'
router.get('', [], GetAllTransaction); // Added route for GetTransactionByCode
router.post('/create', upload.fields([{ name: 'payment', maxCount: 1 }]), CreateNewTransaction); // Updated to 'CreateNewTransaction'
router.put('/update/:id', upload.fields([{ name: 'payment', maxCount: 1 }]), UpdateTransactionById); // Updated to 'UpdateTransactionById'
router.delete('/delete/:id', [], DeleteTransactionById); // Updated to 'DeleteTransactionById'

module.exports = router;
