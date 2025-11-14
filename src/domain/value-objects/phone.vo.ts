
export class Phone {
  private readonly value: string;

  constructor(phone: string) {
    this.validate(phone);
    this.value = phone.trim();
  }

  private validate(phone: string): void {
    if (!phone) {
      return; 
    }

    const phoneRegex = /^\+52 \d{3} \d{3} \d{4}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Formato de teléfono inválido. Se espera: +52 XXX XXX XXXX');
    }
  }

  getValue(): string | null {
    return this.value || null;
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}