import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import LoginPage from "./pages/login-page";
import HomePage from "./pages/protected-pages/home-page";
import FourOhFourPage from "./pages/404page";
import { PrivateRoute } from "./pages/protected-pages/protected.componente";
import AddTaskPage from "./pages/protected-pages/add-task.page";
import EditTaskPage from "./pages/protected-pages/edit-task.page";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <HomePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/add",
    element: (
      <PrivateRoute>
        <AddTaskPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/edit/:id",
    element: (
      <PrivateRoute>
        <EditTaskPage />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <FourOhFourPage />, // Redireciona '/' para '/login'
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
