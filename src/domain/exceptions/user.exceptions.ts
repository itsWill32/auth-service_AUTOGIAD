
export class UserAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}

export class UserNotFoundException extends Error {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundException';
  }
}

export class InvalidCredentialsException extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsException';
  }
}

export class EmailNotVerifiedException extends Error {
  constructor(email: string) {
    super(`Email ${email} is not verified. Please verify your email first.`);
    this.name = 'EmailNotVerifiedException';
  }
}

export class WeakPasswordException extends Error {
  constructor(requirements: string) {
    super(`Password does not meet requirements: ${requirements}`);
    this.name = 'WeakPasswordException';
  }
}

export class UnauthorizedRoleChangeException extends Error {
  constructor(currentRole: string, attemptedRole: string) {
    super(`Cannot change role from ${currentRole} to ${attemptedRole} without admin privileges`);
    this.name = 'UnauthorizedRoleChangeException';
  }
}