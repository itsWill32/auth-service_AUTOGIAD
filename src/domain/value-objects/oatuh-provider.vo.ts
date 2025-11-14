
export enum OAuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

export class OAuthProviderVO {
  private readonly value: OAuthProvider;

  constructor(provider: OAuthProvider | string) {
    this.validate(provider);
    this.value = provider as OAuthProvider;
  }

  private validate(provider: string): void {
    if (!Object.values(OAuthProvider).includes(provider as OAuthProvider)) {
      throw new Error(` OAuth inválido: ${provider}`);
    }
  }

  getValue(): OAuthProvider {
    return this.value;
  }

  isEmail(): boolean {
    return this.value === OAuthProvider.EMAIL;
  }

  isGoogle(): boolean {
    return this.value === OAuthProvider.GOOGLE;
  }

  equals(other: OAuthProviderVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}