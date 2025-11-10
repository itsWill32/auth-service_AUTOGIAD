// auth-service/src/domain/entities/user.entity.ts

export class User {
  id: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  googleId?: string;
  provider?: string;
  isVerified: boolean;
  isActive: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  /**
   * Retorna el nombre completo del usuario
   */
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.firstName || this.email;
  }

  /**
   * Verifica si el usuario puede autenticarse
   */
  canAuthenticate(): boolean {
    return this.isActive && this.isVerified;
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  /**
   * Retorna una versión segura del usuario (sin password)
   */
  toSafeObject() {
    const { password, ...safeUser } = this;
    return safeUser;
  }
}