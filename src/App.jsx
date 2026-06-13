import { GameProvider } from './context/GameContext';
import AppShell from './components/layout/AppShell';

export default function App() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  );
}
