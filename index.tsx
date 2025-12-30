
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render React app:", error);
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>애플리케이션 로드 오류</h2>
        <p>환경 설정 또는 자바스크립트 실행 중 오류가 발생했습니다.</p>
        <code style="background: #eee; padding: 10px; display: block;">${error}</code>
      </div>
    `;
  }
}
