const { Router } = require('express');
const {
  GetMerchandiseById,
  GetAllMerchandise,
  CreateNewMerchandise,
  UpdateMerchandiseById,
  DeleteMerchandiseById,
} = require('../controllers/merchandise');
const upload  = require('../middlewares/multer');

const router = Router();

router.get('/list', [], GetAllMerchandise);
router.get('/:id', [], GetMerchandiseById);
router.post('/create', upload.fields([{ name: 'image', maxCount: 1 }]), CreateNewMerchandise);
router.put('/update/:id', upload.fields([{ name: 'image', maxCount: 1 }]), UpdateMerchandiseById);
router.delete('/delete/:id', [], DeleteMerchandiseById);

module.exports = router;
