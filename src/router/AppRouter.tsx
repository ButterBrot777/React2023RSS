import { createBrowserRouter } from "react-router-dom";
import { App } from "../App.tsx";
import { PageNotFound } from "../pages/PageNotFound.tsx";
import { Item } from "../components/Item.tsx";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: ":id/search",
        element: <Item />,
        errorElement: <PageNotFound />,
      },
      {
        path: "search",
        element: <Item />,
        errorElement: <PageNotFound />,
      },
    ],
  },
]);
