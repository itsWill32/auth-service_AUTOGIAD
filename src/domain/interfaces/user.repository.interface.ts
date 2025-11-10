// auth-service/src/domain/interfaces/user.repository.interface.ts

import { User } from '../entities/user.entity';

export interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
}

export interface IUserRepository {
  /**
   * Crea un nuevo usuario en la base de datos
   */
  create(data: CreateUserData): Promise<User>;

  /**
   * Busca un usuario por email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca un usuario por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca un usuario por Google ID
   */
  findByGoogleId(googleId: string): Promise<User | null>;

  /**
   * Actualiza el último login del usuario
   */
  updateLastLogin(userId: string): Promise<void>;

  /**
   * Marca el email como verificado
   */
  markEmailAsVerified(userId: string): Promise<void>;
}