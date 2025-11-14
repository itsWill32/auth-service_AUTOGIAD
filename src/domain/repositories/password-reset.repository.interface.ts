import { PasswordReset } from '../entities/password-reset.entity';


export interface IPasswordResetRepository {

  save(passwordReset: PasswordReset): Promise<PasswordReset>;


  findByToken(token: string): Promise<PasswordReset | null>;


  findByUserId(userId: string): Promise<PasswordReset[]>;


  delete(id: string): Promise<void>;


  deleteByUserId(userId: string): Promise<void>;


  deleteExpiredOrUsed(): Promise<number>;


  markAsUsed(id: string): Promise<void>;
}