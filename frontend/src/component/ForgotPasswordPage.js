import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Verification code sent to your email successfully!');
        setCodeSent(true);
      } else {
        const errorMessage = data.error || data.message ||'Failed to send verification code.';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Send code error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-forgot-password-code`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          providedCode: formData.code,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password updated successfully!');
        alert("password Changed")
        navigate('/');
      } else {
        const errorMessage = data.error || 'Failed to update password.';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Update password error:', err);
    } finally {
      setLoading(false);
    }
  };

  // const handleBackToLogin = () => {
  //   window.location.href = '/login';
  // };

return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="card-title text-primary">Forgot Password</h2>
                  <p className="text-muted">
                    {codeSent
                      ? 'Enter the verification code and new password'
                      : 'Enter your email to receive a verification code'}
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={codeSent ? handleUpdatePassword : handleSendCode}>
                  {/* Email field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={codeSent}
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* If code is sent, show these fields */}
                  {codeSent && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="code" className="form-label">Verification Code</label>
                        <input
                          type="text"
                          className="form-control"
                          id="code"
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          required
                          placeholder="Enter verification code"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          required
                          placeholder="Enter new password"
                        />
                      </div>
                    </>
                  )}

                  <div className="d-grid gap-2 mb-3">
                    <button
                      type="submit"
                      className={`btn ${codeSent ? 'btn-success' : 'btn-primary'}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {codeSent ? 'Updating...' : 'Sending...'}
                        </>
                      ) : (
                        codeSent ? 'Update Password' : 'Send Code'
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
                      onClick={() => navigate('/')}
                      disabled={loading}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;