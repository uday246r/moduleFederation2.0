import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "./App";
import { BrowserRouter } from "react-router-dom";


test("renders App component without crashing", () => {
  render(<App />);
  expect(true).toBe(true);
});
