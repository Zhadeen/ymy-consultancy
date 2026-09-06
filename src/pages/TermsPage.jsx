import LegalPage from '../components/legal/LegalPage';
import { LEGAL } from '../config/legal';

export default function TermsPage() {
  return <LegalPage doc={LEGAL.terms} path="/terms" />;
}
