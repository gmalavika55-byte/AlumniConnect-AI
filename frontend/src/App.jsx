import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import './styles/main.css';
import './styles/dashboard.css';
import './styles/landing.css';
import './styles/theme.css';

export function App() {
  return (
    <AppProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            colorBgContainer: '#ffffff',
            colorTextHeading: '#0f172a',
            colorText: '#334155',
          },
          components: {
            Button: { controlHeight: 40, borderRadius: 8 },
            Card: { borderRadiusLG: 14 },
            Table: { borderRadius: 10 }
          }
        }}
      >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </AppProvider>
  );
}

export default App;
