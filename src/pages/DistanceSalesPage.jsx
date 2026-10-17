import LegalPage from '../components/legal/LegalPage';
import { LEGAL } from '../config/legal';

export default function DistanceSalesPage() {
  return <LegalPage doc={LEGAL.distanceSales} path="/distance-sales-contract" />;
}
