import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/asmin")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
  component: () => null,
});
