import { describe, test, it, expect } from "vitest";
import { validateTransactionInput } from "../../../src/domain/services/validationService";

describe('validateTransactionInput', () => {
  it('deve retornar erro se o totalAmount for inválido', () => {
    const result = validateTransactionInput(-10, '5411');

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid totalAmount. It must be a positive number.');
  });

  it('deve retornar erro se o MCC for inválido', () => {
    const result = validateTransactionInput(30, '9999');

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid MCC code.');
  });

  it('deve validar corretamente para inputs válidos', () => {
    const result = validateTransactionInput(30, '5411');

    expect(result.isValid).toBe(true);
  });
});
