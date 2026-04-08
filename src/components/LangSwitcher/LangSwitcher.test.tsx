import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LangSwitcher from "./LangSwitcher";

const mockChangeLanguage = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      language: "en",
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

describe("LangSwitcher", () => {
  it("renders all language options as buttons in desktop view", () => {
    render(<LangSwitcher />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
    expect(buttons[0]).toHaveTextContent("EN");
    expect(buttons[1]).toHaveTextContent("FR");
    expect(buttons[2]).toHaveTextContent("RU");
    expect(buttons[3]).toHaveTextContent("UA");
  });

  it("calls changeLanguage when a button is clicked", () => {
    render(<LangSwitcher />);
    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[1]); // FR
    expect(mockChangeLanguage).toHaveBeenCalledWith("fr");
  });

  it("renders select for mobile", () => {
    render(<LangSwitcher />);

    const select = screen.getByDisplayValue("EN");
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe("SELECT");
  });

  it("calls changeLanguage when select value changes", () => {
    render(<LangSwitcher />);

    const select = screen.getByDisplayValue("EN");
    fireEvent.change(select, { target: { value: "ru" } });
    expect(mockChangeLanguage).toHaveBeenCalledWith("ru");
  });
});
