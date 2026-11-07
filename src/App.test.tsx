import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

describe("GRANTLY navigation and discovery", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("navigates across pages and filters scholarships by search", () => {
    render(<App />);
    fireEvent.click(
      within(
        screen.getByRole("navigation", { name: "Primary navigation" }),
      ).getByRole("button", { name: "Explore Scholarships" }),
    );
    expect(
      screen.getByRole("heading", { name: "Explore scholarships" }),
    ).toBeVisible();

    fireEvent.change(
      screen.getByRole("textbox", { name: "Search scholarships" }),
      {
        target: { value: "Reliance" },
      },
    );
    expect(
      screen.getByText("Reliance Foundation Undergraduate Scholarship"),
    ).toBeVisible();
    expect(
      screen.queryByText("Tata Trusts Means Grant"),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Eligibility Matching" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Find my matches/ }));
    expect(
      screen.getByRole("heading", { name: /scholarships match your profile/ }),
    ).toBeVisible();
  });

  it("saves a scholarship and updates the saved list", () => {
    render(<App />);
    fireEvent.click(
      within(
        screen.getByRole("navigation", { name: "Primary navigation" }),
      ).getByRole("button", { name: "Explore Scholarships" }),
    );
    const card = screen
      .getByText("Reliance Foundation Undergraduate Scholarship")
      .closest("article");
    expect(card).not.toBeNull();
    fireEvent.click(
      within(card!).getByRole("button", { name: "Remove from saved" }),
    );
    expect(localStorage.getItem("grantly-saved")).not.toContain(
      "reliance-foundation",
    );
    fireEvent.click(
      within(card!).getByRole("button", { name: /Save scholarship/ }),
    );
    expect(localStorage.getItem("grantly-saved")).toContain(
      "reliance-foundation",
    );
  });
});
