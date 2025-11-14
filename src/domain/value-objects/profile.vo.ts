import { Phone } from './phone.vo';

export class Profile {
  private readonly fullName: string;
  private readonly phone: Phone | null;
  private readonly avatarUrl: string | null;

  constructor(
    fullName: string,
    phone?: string | null,
    avatarUrl?: string | null,
  ) {
    this.validateFullName(fullName);
    this.fullName = fullName.trim();
    this.phone = phone ? new Phone(phone) : null;
    this.avatarUrl = avatarUrl || null;
  }

  private validateFullName(fullName: string): void {
    if (!fullName) {
      throw new Error('El nombre completo es requerido');
    }

    if (fullName.trim().length < 3) {
      throw new Error('El nombre completo debe tener al menos 3 caracteres');
    }

    if (fullName.length > 100) {
      throw new Error('El nombre completo no debe exceder los 100 caracteres');
    }
  }

  getFullName(): string {
    return this.fullName;
  }

  getPhone(): string | null {
    return this.phone?.getValue() || null;
  }

  getAvatarUrl(): string | null {
    return this.avatarUrl;
  }

  updatePhone(newPhone: string | null): Profile {
    return new Profile(this.fullName, newPhone, this.avatarUrl);
  }

  updateAvatar(newAvatarUrl: string | null): Profile {
    return new Profile(this.fullName, this.phone?.getValue(), newAvatarUrl);
  }

  updateFullName(newFullName: string): Profile {
    return new Profile(newFullName, this.phone?.getValue(), this.avatarUrl);
  }
}