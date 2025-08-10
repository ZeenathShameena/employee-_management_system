// import React from 'react';

const ErrorPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="display-4">404</h1>
      <p className="lead">Oops! The page you're looking for doesn't exist.</p>
      <a href="/dashboard" className="btn btn-primary">Go to Home</a>
    </div>
  );
};

export default ErrorPage;
