import * as bcrypt from 'bcrypt';

export class Password {
  private readonly hashedValue: string;
  private static readonly SALT_ROUNDS = 10;

  private constructor(hashedPassword: string) {
    this.hashedValue = hashedPassword;
  }

  static async create(plainPassword: string): Promise<Password> {
    this.validate(plainPassword);
    const hashed = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
    return new Password(hashed);
  }


  static fromHash(hashedPassword: string): Password {
    if (!hashedPassword) {
      throw new Error('password hash es requerido');
    }
    return new Password(hashedPassword);
  }

  private static validate(plainPassword: string): void {
    if (!plainPassword) {
      throw new Error('password es requerido');
    }

    if (plainPassword.length < 8) {
      throw new Error('password debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(plainPassword)) {
      throw new Error('password debe contener al menos una letra mayúscula');
    }

    if (!/[a-z]/.test(plainPassword)) {
      throw new Error('password debe contener al menos una letra minúscula');
    }

    if (!/[0-9]/.test(plainPassword)) {
      throw new Error('password debe contener al menos un número');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(plainPassword)) {
      throw new Error('password debe contener al menos un carácter especial');
    }
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hashedValue);
  }

  getHash(): string {
    return this.hashedValue;
  }
}