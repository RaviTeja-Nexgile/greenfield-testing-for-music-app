import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
