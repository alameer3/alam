import AuthenticHeader from './AuthenticHeader';
import AuthenticFooter from './AuthenticFooter';

interface AuthenticLayoutProps {
  children: React.ReactNode;
  bodyClass?: string;
}

const AuthenticLayout = ({ children, bodyClass = '' }: AuthenticLayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col ${bodyClass}`} style={{ backgroundColor: 'var(--bg-primary)' }}>
      <AuthenticHeader />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <AuthenticFooter />
    </div>
  );
};

export default AuthenticLayout;