import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import Trade from "./pages/Trade";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import Marketplace from "./pages/Marketplace";
import Root from "./pages/Root";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "trade", Component: Trade },
      { path: "wallet", Component: Wallet },
      { path: "transactions", Component: Transactions },
      { path: "marketplace", Component: Marketplace },
    ],
  },
]);