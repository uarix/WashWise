import Index from "./pages/Index.jsx";
import Settings from "./pages/Settings.jsx";

export const routes = [
  {
    title: "Home",
    path: "/",
    element: <Index />,
  },
  {
    title: "Settings",
    path: "/settings",
    element: <Settings />,
  },
];