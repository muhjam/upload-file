const { Router } = require('express');
const {
  GetMerchandiseById,
  GetAllMerchandise,
  CreateNewMerchandise,
  UpdateMerchandiseById,
  DeleteMerchandiseById,
} = require('../controllers/merchandises');
const upload  = require('../middlewares/multer');

const router = Router();

router.get('', [], GetAllMerchandise);
router.get('/:id', [], GetMerchandiseById);
router.post('', upload.fields([{ name: 'image', maxCount: 1 }]), CreateNewMerchandise);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }]), UpdateMerchandiseById);
router.delete('/:id', [], DeleteMerchandiseById);

module.exports = router;
