
export enum UserRole {
  VEHICLE_OWNER = 'VEHICLE_OWNER',
  WORKSHOP_ADMIN = 'WORKSHOP_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

export class UserRoleVO {
  private readonly value: UserRole;

  constructor(role: UserRole | string) {
    this.validate(role);
    this.value = role as UserRole;
  }

  private validate(role: string): void {
    if (!Object.values(UserRole).includes(role as UserRole)) {
      throw new Error(`Invalid user role: ${role}`);
    }
  }

  getValue(): UserRole {
    return this.value;
  }

  isVehicleOwner(): boolean {
    return this.value === UserRole.VEHICLE_OWNER;
  }

  isWorkshopAdmin(): boolean {
    return this.value === UserRole.WORKSHOP_ADMIN;
  }

  isSystemAdmin(): boolean {
    return this.value === UserRole.SYSTEM_ADMIN;
  }

  equals(other: UserRoleVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}