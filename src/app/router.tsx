import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AgentWorkspaceLayout from "../components/layout/AgentWorkspaceLayout";

import Home from "../pages/Home";
import Search from "../pages/Search";
import Assistant from "../pages/Assistant";
import PricePrediction from "../pages/PricePrediction";
import PropertyDetails from "../pages/PropertyDetails";

import Favorites from "../pages/favorites/Favorites";
import BookViewing from "../pages/bookings/BookViewing";
import MyBookings from "../pages/bookings/MyBookings";
import Messages from "../pages/messages/Messages";
import Profile from "../pages/profile/Profile";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AgentDashboard from "../pages/agent/AgentDashboard";
import AgentProperties from "../pages/agent/AgentProperties";
import AgentViewings from "../pages/agent/AgentViewings";

export const router = createBrowserRouter([
  {
    path: "/agent",
    element: <AgentWorkspaceLayout />,
    children: [
      { index: true, element: <AgentDashboard /> },
      { path: "properties", element: <AgentProperties /> },
      { path: "viewings", element: <AgentViewings /> },
      { path: "messages", element: <Messages /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "search",
        element: <Search />,
      },

      {
        path: "assistant",
        element: <Assistant />,
      },

      {
        path: "price-prediction",
        element: <PricePrediction />,
      },

      {
        path: "properties/:id",
        element: <PropertyDetails />,
      },

      {
        path: "favorites",
        element: <Favorites />,
      },

      {
        path: "book-viewing",
        element: <BookViewing />,
      },

      {
        path: "bookings",
        element: <MyBookings />,
      },

      {
        path: "messages",
        element: <Messages />,
      },

      {
        path: "profile",
        element: <Profile />,
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        path: "*",
        element: (
          <p className="p-10 text-center text-slate-500">Page not found.</p>
        ),
      },
    ],
  },
]);
