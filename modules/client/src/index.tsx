import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import App from './App';
import Rooms from './pages/Rooms';
import Login from './pages/Login';

ReactDOM.createRoot(document.getElementById('app') as HTMLDivElement).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <ChakraProvider>
            <App />
          </ChakraProvider>
        }
      >
        <Route index element={<Login />} />
        <Route path="rooms" element={<Rooms />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
