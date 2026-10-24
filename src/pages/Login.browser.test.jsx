import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "./Login";

function renderLogin() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Página principal</h1>} />
          <Route path="/admin" element={<h1>Panel admin</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("Pruebas de navegador del inicio de sesión", () => {
  it("PF-01: muestra el formulario de inicio de sesión", () => {
    renderLogin();

    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });

  it("PF-02: permite escribir las credenciales", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/correo/i), "cliente@correo.cl");
    await user.type(screen.getByLabelText(/contraseña/i), "1234");

    expect(screen.getByLabelText(/correo/i)).toHaveValue("cliente@correo.cl");
    expect(screen.getByLabelText(/contraseña/i)).toHaveValue("1234");
  });

  it("PF-03: inicia sesión con datos válidos y navega al inicio", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/correo/i), "cliente@correo.cl");
    await user.type(screen.getByLabelText(/contraseña/i), "1234");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(localStorage.getItem("usuarioHuka")).toBe("cliente@correo.cl");
    expect(
      await screen.findByRole("heading", { name: /página principal/i })
    ).toBeInTheDocument();
  });

  it("PF-04: con un correo inválido muestra error y no crea sesión", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/correo/i), "correo-malo");
    await user.type(screen.getByLabelText(/contraseña/i), "1234");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/correo válido/i);
    expect(localStorage.getItem("usuarioHuka")).toBeNull();
    expect(
      screen.queryByRole("heading", { name: /página principal/i })
    ).not.toBeInTheDocument();
  });

  it("PF-05: con campos vacíos muestra error y no crea sesión", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/completa todos los campos/i);
    expect(localStorage.getItem("usuarioHuka")).toBeNull();
  });

  it("PF-06: un correo @huka.com navega al panel de administración", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/correo/i), "admin@huka.com");
    await user.type(screen.getByLabelText(/contraseña/i), "1234");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      await screen.findByRole("heading", { name: /panel admin/i })
    ).toBeInTheDocument();
  });

  it("PF-07: la pestaña Registrarse pide el nombre", async () => {
    const user = userEvent.setup();
    renderLogin();

    expect(screen.queryByLabelText(/nombre completo/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
  });
});
