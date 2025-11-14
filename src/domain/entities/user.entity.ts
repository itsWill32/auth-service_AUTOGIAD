import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { UserRoleVO, UserRole } from '../value-objects/user-role.vo';
import { Profile } from '../value-objects/profile.vo';
import { OAuthProviderVO, OAuthProvider } from '../value-objects/oatuh-provider.vo';

export class User {
  private readonly id: string;
  private email: Email;
  private password: Password | null;
  private role: UserRoleVO;
  private profile: Profile;
  private oauthProvider: OAuthProviderVO;
  private isEmailVerified: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    email: Email,
    role: UserRoleVO,
    profile: Profile,
    oauthProvider: OAuthProviderVO,
    password?: Password | null,
    isEmailVerified: boolean = false,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.validateBusinessRules(password, oauthProvider);

    this.id = id;
    this.email = email;
    this.password = password || null;
    this.role = role;
    this.profile = profile;
    this.oauthProvider = oauthProvider;
    this.isEmailVerified = isEmailVerified;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }



  static async createWithEmailPassword(
    id: string,
    email: Email,
    plainPassword: string,
    fullName: string,
    role: UserRole = UserRole.VEHICLE_OWNER,
    phone?: string,
  ): Promise<User> {
    const password = await Password.create(plainPassword);
    const roleVO = new UserRoleVO(role);
    const profile = new Profile(fullName, phone, null);
    const oauthProvider = new OAuthProviderVO(OAuthProvider.EMAIL);

    return new User(id, email, roleVO, profile, oauthProvider, password, false);
  }



  static createWithOAuth(
    id: string,
    email: Email,
    fullName: string,
    avatarUrl?: string,
    role: UserRole = UserRole.VEHICLE_OWNER,
  ): User {
    const roleVO = new UserRoleVO(role);
    const profile = new Profile(fullName, null, avatarUrl);
    const oauthProvider = new OAuthProviderVO(OAuthProvider.GOOGLE);

    return new User(
      id,
      email,
      roleVO,
      profile,
      oauthProvider,
      null, 
      true, 
    );
  }


  private validateBusinessRules(
    password: Password | null,
    oauthProvider: OAuthProviderVO,
  ): void {
    if (oauthProvider.isEmail() && !password) {
      throw new Error('Los usuarios EMAIL deben tener una contraseña');
    }

    if (oauthProvider.isGoogle() && password) {
      throw new Error('Los usuarios OAuth no deben tener una contraseña');
    }
  }


  async verifyPassword(plainPassword: string): Promise<boolean> {
    if (!this.password) {
      throw new Error('Este usuario no tiene contraseña (usuario OAuth)');
    }

    return this.password.compare(plainPassword);
  }


  updateProfile(fullName?: string, phone?: string, avatarUrl?: string): void {
    if (fullName) {
      this.profile = this.profile.updateFullName(fullName);
    }
    if (phone !== undefined) {
      this.profile = this.profile.updatePhone(phone);
    }
    if (avatarUrl !== undefined) {
      this.profile = this.profile.updateAvatar(avatarUrl);
    }
    this.updatedAt = new Date();
  }


  async changePassword(newPlainPassword: string): Promise<void> {
    if (this.oauthProvider.isGoogle()) {
      throw new Error('No se puede cambiar la contraseña para usuarios OAuth');
    }

    this.password = await Password.create(newPlainPassword);
    this.updatedAt = new Date();
  }

  verifyEmail(): void {
    this.isEmailVerified = true;
    this.updatedAt = new Date();
  }


  changeRole(newRole: UserRole, performedBy: User): void {
    if (!performedBy.isSystemAdmin()) {
      throw new Error('Solo el SYSTEM_ADMIN puede cambiar roles de usuario');
    }

    this.role = new UserRoleVO(newRole);
    this.updatedAt = new Date();
  }


  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getPasswordHash(): string | null {
    return this.password?.getHash() || null;
  }

  getRole(): UserRole {
    return this.role.getValue();
  }

  getProfile(): Profile {
    return this.profile;
  }

  getFullName(): string {
    return this.profile.getFullName();
  }

  getPhone(): string | null {
    return this.profile.getPhone();
  }

  getAvatarUrl(): string | null {
    return this.profile.getAvatarUrl();
  }

  getOAuthProvider(): OAuthProvider {
    return this.oauthProvider.getValue();
  }

  isVerified(): boolean {
    return this.isEmailVerified;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  isVehicleOwner(): boolean {
    return this.role.isVehicleOwner();
  }

  isWorkshopAdmin(): boolean {
    return this.role.isWorkshopAdmin();
  }

  isSystemAdmin(): boolean {
    return this.role.isSystemAdmin();
  }

  isOAuthUser(): boolean {
    return this.oauthProvider.isGoogle();
  }

  hasPassword(): boolean {
    return this.password !== null;
  }
}