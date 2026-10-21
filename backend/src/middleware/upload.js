import multer from 'multer';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.uploadMaxBytes,
    files: 1,
  },
  fileFilter(_req, file, cb) {
    const name = (file.originalname || '').toLowerCase();
    const mimeOk = file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf';
    if (!name.endsWith('.pdf') || !mimeOk) {
      return cb(ApiError.badRequest('Resume must be a PDF file'));
    }
    return cb(null, true);
  },
});

export const resumeUpload = upload.single('resume');

export function handleMulterError(err, _req, _res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(ApiError.badRequest('Resume must be 5 MB or smaller'));
    }
    return next(ApiError.badRequest(err.message));
  }
  return next(err);
}

export default resumeUpload;
