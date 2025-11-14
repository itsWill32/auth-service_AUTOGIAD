
export class RefreshTokenExpiredException extends Error {
  constructor(tokenId: string) {
    super(`Refresh token ${tokenId} has expired`);
    this.name = 'RefreshTokenExpiredException';
  }
}

export class RefreshTokenNotFoundException extends Error {
  constructor(token: string) {
    super('Invalid or revoked refresh token');
    this.name = 'RefreshTokenNotFoundException';
  }
}

export class RefreshTokenMismatchException extends Error {
  constructor(userId: string) {
    super(`Refresh token does not belong to user ${userId}`);
    this.name = 'RefreshTokenMismatchException';
  }
}