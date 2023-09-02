export class UserCancelledError extends Error {
  constructor(message: string = 'User cancelled') {
    super(message);
    this.name = 'UserCancelledError';

    // This is to make the instanceof operator work with custom errors in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
