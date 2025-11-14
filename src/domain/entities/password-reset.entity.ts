
export class PasswordReset {
  private readonly id: string;
  private readonly token: string;
  private readonly userId: string;
  private readonly expiresAt: Date;
  private used: boolean;
  private readonly createdAt: Date;

  constructor(
    id: string,
    token: string,
    userId: string,
    expiresAt: Date,
    used: boolean = false,
    createdAt?: Date,
  ) {
    this.id = id;
    this.token = token;
    this.userId = userId;
    this.expiresAt = expiresAt;
    this.used = used;
    this.createdAt = createdAt || new Date();
  }


  static create(id: string, token: string, userId: string): PasswordReset {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    return new PasswordReset(id, token, userId, expiresAt, false);
  }


  markAsUsed(): void {
    if (this.used) {
      throw new Error('Este token de restablecimiento de contraseña ya ha sido utilizado');
    }

    if (this.isExpired()) {
      throw new Error('Este token de restablecimiento de contraseña ha expirado');
    }

    this.used = true;
  }


  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }


  isValid(): boolean {
    return !this.used && !this.isExpired();
  }

  belongsTo(userId: string): boolean {
    return this.userId === userId;
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

  isUsed(): boolean {
    return this.used;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}