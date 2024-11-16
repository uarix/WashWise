import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} exact element={element} />
        ))}
        <Route path="*" element={<></>} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;