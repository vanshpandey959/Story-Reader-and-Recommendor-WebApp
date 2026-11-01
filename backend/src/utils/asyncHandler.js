/** Lets controllers be async without try/catch - rejected promises go to the error middleware. */
export default (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
