import { QueryProvider } from '@app/providers/QueryProvider.tsx';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </QueryProvider>
  </React.StrictMode>
);
