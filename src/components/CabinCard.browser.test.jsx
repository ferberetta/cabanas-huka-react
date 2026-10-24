import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CabinCard from "./CabinCard";

const cabinPrueba = {
  id: "roble",
  name: "Cabaña Roble",
  capacity: "2 a 4 personas",
  price: 60000,
  image: "https://ejemplo.cl/roble.jpg",
};

function renderCard(cabin = cabinPrueba) {
  return render(
    <MemoryRouter>
      <CabinCard cabin={cabin} />
    </MemoryRouter>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CabinCard", () => {
  it("PF-08: muestra los datos que recibe por props", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: "Cabaña Roble" })).toBeInTheDocument();
    expect(screen.getByText("2 a 4 personas")).toBeInTheDocument();
    expect(screen.getByText("$60.000")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Cabaña Roble" })).toBeInTheDocument();
  });

  it("PF-09: es reutilizable, muestra otra cabaña con otros props", () => {
    renderCard({
      id: "araucaria",
      name: "Cabaña Araucaria",
      capacity: "4 a 6 personas",
      price: 85000,
      image: "https://ejemplo.cl/araucaria.jpg",
    });

    expect(screen.getByRole("heading", { name: "Cabaña Araucaria" })).toBeInTheDocument();
    expect(screen.getByText("$85.000")).toBeInTheDocument();
    expect(screen.queryByText("Cabaña Roble")).not.toBeInTheDocument();
  });

  it("PF-10: el botón Reservar apunta a la cabaña elegida", () => {
    renderCard();

    expect(screen.getByRole("link", { name: "Reservar" })).toHaveAttribute(
      "href",
      "/reservar?cabana=roble"
    );
  });

  it("PF-11: el botón Ver apunta al detalle de la cabaña", () => {
    renderCard();

    expect(screen.getByRole("link", { name: "Ver" })).toHaveAttribute(
      "href",
      "/cabanas#roble"
    );
  });

  it("PF-12: al hacer clic en Reservar muestra la cabaña por consola", async () => {
    const espia = vi.spyOn(console, "log").mockImplementation(() => {});
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("link", { name: "Reservar" }));

    expect(espia).toHaveBeenCalledWith(
      "Reservar cabaña:",
      "Cabaña Roble",
      "| Precio por noche:",
      "$60.000",
      "| Capacidad:",
      "2 a 4 personas"
    );
  });
});
