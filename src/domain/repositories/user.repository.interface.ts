import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';


export interface IUserRepository {

  save(user: User): Promise<User>;


  findById(id: string): Promise<User | null>;


  findByEmail(email: Email): Promise<User | null>;


  findByOAuthProvider(provider: string, email: Email): Promise<User | null>;

  existsByEmail(email: Email): Promise<boolean>;

  delete(id: string): Promise<void>;

  markEmailAsVerified(userId: string): Promise<void>;


  findAll(page: number, limit: number): Promise<{ users: User[]; total: number }>;

  findByRole(role: string): Promise<User[]>;
}