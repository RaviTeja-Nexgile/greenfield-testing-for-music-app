import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Player from './pages/Player';
import AppShell from './components/AppShell';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route element={<AppShell />}>
        <Route path="/home" element={<div />} />
        <Route path="/search" element={<div />} />
        <Route path="/player" element={<Player />} />
        <Route path="/library" element={<div />} />
        <Route path="/profile" element={<div />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
