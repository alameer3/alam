import React from 'react';

const AuthenticFooter: React.FC = () => {
  return (
    <footer className="bg-body-extra-light" style={{ marginTop: '50px' }}>
      <div className="content py-3">
        <div className="row font-size-sm">
          <div className="col-sm-6 order-sm-2 py-1 text-center text-sm-right">
            <a className="font-w600" href="/" target="_blank">
              اكوام
            </a>
          </div>
          <div className="col-sm-6 order-sm-1 py-1 text-center text-sm-left">
            <span className="text-muted">
              جميع الحقوق محفوظة © 2025
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthenticFooter;