import { useRegisterSW } from 'virtual:pwa-register/react';
import { PixelButton } from '../ui/components';
export function UpdateNotice() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();
  if (!needRefresh) return null;
  return <aside className="update-notice" aria-label="Atualização disponível">
    <p>Uma nova versão da fábrica está pronta.</p>
    <div className="flex flex-wrap gap-3"><PixelButton onClick={() => void updateServiceWorker(true)}>Atualizar</PixelButton><PixelButton onClick={() => setNeedRefresh(false)}>Depois</PixelButton></div>
  </aside>;
}
