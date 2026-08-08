import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AppProvider, useAppContext } from './context/AppContext';
import './styles/main.css';
import './styles/dashboard.css';
import './styles/landing.css';
import './styles/theme.css';

const AppContent = () => {
  const { theme } = useAppContext();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorBgContainer: theme === 'dark' ? '#161b22' : '#ffffff',
          colorTextHeading: theme === 'dark' ? '#e6edf3' : '#0f172a',
          colorText: theme === 'dark' ? '#cbd5e1' : '#334155',
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
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
