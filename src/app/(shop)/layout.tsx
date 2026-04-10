import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloating } from '@/components/shop/WhatsAppFloating';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <Header />
      <div className="pt-16 lg:pt-20">{children}</div>
      <Footer />
      <WhatsAppFloating />
    </>
  );
}
