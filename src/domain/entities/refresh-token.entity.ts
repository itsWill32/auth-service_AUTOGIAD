
export class RefreshToken {
  private readonly id: string;
  private readonly token: string;
  private readonly userId: string;
  private readonly expiresAt: Date;
  private readonly createdAt: Date;

  constructor(
    id: string,
    token: string,
    userId: string,
    expiresAt: Date,
    createdAt?: Date,
  ) {
    this.id = id;
    this.token = token;
    this.userId = userId;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt || new Date();
  }


  static create(
    id: string,
    token: string,
    userId: string,
    daysToExpire: number = 7,
  ): RefreshToken {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysToExpire);

    return new RefreshToken(id, token, userId, expiresAt);
  }


  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  belongsTo(userId: string): boolean {
    return this.userId === userId;
  }

  getDaysUntilExpiration(): number {
    const now = new Date();
    const diff = this.expiresAt.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }


  getId(): string {
    return this.id;
  }

  getToken(): string {
    return this.token;
  }

  getUserId(): string {
    return this.userId;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}