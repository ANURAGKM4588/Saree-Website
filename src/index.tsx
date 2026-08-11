import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<RouterProvider router={router} />);
}
