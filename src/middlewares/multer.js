const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Direktori untuk menyimpan file
const userImageDir = path.join(__dirname, '../public/images/users');
const memberImageDir = path.join(__dirname, '../public/images/members');
const merchandiseDir = path.join(__dirname, '../public/images/merchandises');
const activitiesDir = path.join(__dirname, '../public/images/activities');
const transactionDir = path.join(__dirname, '../public/images/transactions');
const proofDir = path.join(__dirname, '../public/images/proofs');
const bannerDir = path.join(__dirname, '../public/images/banners');
const supportingDocumentDir = path.join(__dirname, '../../documents/competitions');

// Membuat direktori jika belum ada
[userImageDir, memberImageDir, proofDir, supportingDocumentDir, bannerDir, merchandiseDir, transactionDir, activitiesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'photo') {
            cb(null, userImageDir);
        }else if (file.fieldname === 'picture') {
            cb(null, memberImageDir);
        }else if (file.fieldname === 'image' || file.fieldname === 'file') {
            cb(null, merchandiseDir);
        }else if (file.fieldname === 'imageActivity') {
            cb(null, activitiesDir);
        }else if (file.fieldname === 'payment') {
            cb(null, transactionDir);
        }else if (file.fieldname === 'proof') {
            cb(null, proofDir);
        } else if (file.fieldname === 'supportingDocuments') {
            cb(null, supportingDocumentDir);
        } else if (file.fieldname === 'banner') {
            cb(null, bannerDir);
        } else {
            cb(new Error('Invalid field name'), false);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'supportingDocuments' || file.fieldname === 'file') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('File must be a PDF!'), false);
        }
    } else if (file.fieldname === 'proof') {
        if (file.mimetype === 'image/jpeg' || 
            file.mimetype === 'image/png' || 
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('File must be an image (jpeg, png, jpg) or a PDF!'), false);
        }
    } else if (file.mimetype === 'image/jpeg' || 
               file.mimetype === 'image/png' || 
               file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('File must be an image!'), false);
    }
};

// Konfigurasi multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Batasan ukuran file 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
