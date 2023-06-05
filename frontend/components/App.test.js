// Write your tests here
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
//import { fireEvent } from "@testing-library/react";

import AppFunctional from "./AppFunctional"


test("renders without errors", () => {
  render(<AppFunctional />);

});

test("When app mounts, coordinates exists on the screen", async () => {
  render(<AppFunctional />);
  const header = screen.getByText("Coordinates (2, 2)");
  expect(header).toBeInTheDocument;
});