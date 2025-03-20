import multer from 'multer';

const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage: storage });


export default upload;
