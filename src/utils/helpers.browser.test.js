import { describe, expect, it } from "vitest";
import { emailValido, clp } from "./helpers";

describe("helpers", () => {
  it("PF-01: acepta un correo válido", () => {
    expect(emailValido("nombre@correo.cl")).toBe(true);
  });

  it("PF-02: rechaza un correo sin arroba", () => {
    expect(emailValido("nombrecorreo.cl")).toBe(false);
  });

  it("PF-03: ignora espacios al inicio y al final", () => {
    expect(emailValido("  nombre@correo.cl  ")).toBe(true);
  });

  it("PF-04: formatea un precio con separador de miles", () => {
    expect(clp(60000)).toBe("$60.000");
  });
});