import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import App from './App';
import Rooms from './pages/Rooms';
import RoomsList from './pages/Rooms/components/RoomsList';
import Room from './pages/Room';
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
        <Route path="rooms" element={<Rooms />}>
          <Route index element={<RoomsList />} />
          <Route path=":id" element={<Room />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
);
