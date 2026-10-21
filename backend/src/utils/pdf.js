<<<<<<< HEAD
const PDF_MAGIC = Buffer.from('%PDF');

export function isPdfBuffer(buffer) {
  if (!buffer || buffer.length < 5) return false;
  return buffer.subarray(0, 4).equals(PDF_MAGIC);
}

export function isAllowedResumeFile({ originalname, mimetype, buffer }) {
  const ext = (originalname || '').toLowerCase().endsWith('.pdf');
  const mimeOk = mimetype === 'application/pdf' || mimetype === 'application/x-pdf';
  return ext && mimeOk && isPdfBuffer(buffer);
}
=======
const PDF_MAGIC = Buffer.from('%PDF');

export function isPdfBuffer(buffer) {
  if (!buffer || buffer.length < 5) return false;
  return buffer.subarray(0, 4).equals(PDF_MAGIC);
}

export function isAllowedResumeFile({ originalname, mimetype, buffer }) {
  const ext = (originalname || '').toLowerCase().endsWith('.pdf');
  const mimeOk = mimetype === 'application/pdf' || mimetype === 'application/x-pdf';
  return ext && mimeOk && isPdfBuffer(buffer);
}
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
