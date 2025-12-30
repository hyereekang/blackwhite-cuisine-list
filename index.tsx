
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("결정적인 오류: 'root' 엘리먼트를 찾을 수 없습니다.");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React 애플리케이션이 정상적으로 마운트되었습니다.");
} catch (error) {
  console.error("React 렌더링 중 치명적 오류 발생:", error);
  rootElement.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: sans-serif; color: #333;">
      <h2 style="color: #e11d48;">⚠️ 앱 실행 오류</h2>
      <p>애플리케이션을 로드하는 중 문제가 발생했습니다.</p>
      <div style="background: #f1f1f1; padding: 15px; border-radius: 8px; text-align: left; display: inline-block; margin-top: 20px; max-width: 90%;">
        <pre style="margin: 0; white-space: pre-wrap; font-size: 13px;">${error instanceof Error ? error.stack : String(error)}</pre>
      </div>
      <p style="margin-top: 20px;"><button onclick="window.location.reload()" style="padding: 10px 20px; background: #ea580c; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">페이지 새로고침</button></p>
    </div>
  `;
}
