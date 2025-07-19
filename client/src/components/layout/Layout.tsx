import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  bodyClass?: string;
}

const Layout = ({ children, bodyClass = '' }: LayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col ${bodyClass}`} style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;