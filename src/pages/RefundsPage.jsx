import LegalPage from '../components/legal/LegalPage';
import { LEGAL } from '../config/legal';

export default function RefundsPage() {
  return <LegalPage doc={LEGAL.refunds} path="/refunds" />;
}
