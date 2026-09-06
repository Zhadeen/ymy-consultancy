import LegalPage from '../components/legal/LegalPage';
import { LEGAL } from '../config/legal';

export default function CookiesPage() {
  return <LegalPage doc={LEGAL.cookies} path="/cookies" />;
}
