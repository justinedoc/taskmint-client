import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";

export const Route = createFileRoute("/_landing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
