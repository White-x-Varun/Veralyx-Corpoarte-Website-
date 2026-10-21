<<<<<<< HEAD
export default function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
=======
export default function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
