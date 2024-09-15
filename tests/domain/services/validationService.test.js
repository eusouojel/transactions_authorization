import { describe, test, it, expect } from "vitest";
import { validateTransactionInput } from "../../../src/domain/services/validationService";

describe('validateTransactionInput', () => {
  it('deve retornar erro se o totalAmount for negativo', () => {
    const result = validateTransactionInput(-10, '5411');

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid totalAmount. It must be a positive number.');
  });

  it('deve falhar se o totalAmount for zero', () => {
    const result = validateTransactionInput(0, '5411');

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid totalAmount. It must be a positive number.');
  });

  it('deve falhar se o totalAmount não for do tipo número', () => {
    const result = validateTransactionInput('mil', '5411');

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid totalAmount. It must be a positive number.');
  });

  it('deve retornar erro se o MCC for inválido', () => {
    const result = validateTransactionInput(30, '9999');

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid MCC code.');
  });

  it('deve falhar se o MCC for nulo', () => {
    const result = validateTransactionInput(30, null);

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid MCC code.');
  });

  it('deve falhar se o MCC for indefinido', () => {
    const result = validateTransactionInput(30, undefined);

    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid MCC code.');
  });

  it('deve validar corretamente para inputs válidos', () => {
    const result = validateTransactionInput(30, '5411');

    expect(result.isValid).toBe(true);
  });
});
