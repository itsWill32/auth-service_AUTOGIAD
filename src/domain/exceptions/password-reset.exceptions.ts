

export class PasswordResetTokenExpiredException extends Error {
  constructor() {
    super('Password reset token has expired. Please request a new one.');
    this.name = 'PasswordResetTokenExpiredException';
  }
}

export class PasswordResetTokenAlreadyUsedException extends Error {
  constructor() {
    super('This password reset token has already been used');
    this.name = 'PasswordResetTokenAlreadyUsedException';
  }
}

export class PasswordResetTokenNotFoundException extends Error {
  constructor() {
    super('Invalid password reset token');
    this.name = 'PasswordResetTokenNotFoundException';
  }
}

export class PasswordResetTokenMismatchException extends Error {
  constructor() {
    super('Password reset token does not belong to this user');
    this.name = 'PasswordResetTokenMismatchException';
  }
}