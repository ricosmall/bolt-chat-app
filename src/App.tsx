import React from 'react';
import { ContainerContext } from './presentation/contexts/ContainerContext';
import { container } from './infrastructure/ioc/container';
import ChatWindow from './presentation/components/ChatWindow';

function App() {
  return (
    <ContainerContext.Provider value={container}>
      <div className="min-h-screen bg-gray-100">
        <ChatWindow />
      </div>
    </ContainerContext.Provider>
  );
}

export default App;