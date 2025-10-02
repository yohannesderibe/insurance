// import React from 'react';
import AppRoutes from './Routes/routes'
import { BrowserRouter } from "react-router-dom";
import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';

function App(){
  return (
    <AuthProvider>
      <BrowserRouter >
          <Suspense fallback={<div>Loading...</div>}>
     <AppRoutes />
      </Suspense>
     </BrowserRouter >
    </AuthProvider>
  );
}

export default App;