import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import App from './App';

ReactDOM.createRoot(document.getElementById('app') as HTMLDivElement).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
);
