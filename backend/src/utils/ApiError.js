/** Error with an HTTP status. The error handler turns it into { message } for the frontend. */
export default class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
