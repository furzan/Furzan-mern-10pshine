import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { forgotpassword, resetpassword } from '../services/auth_Apis';

// Mock the AxiosClient to avoid import.meta issues
jest.mock('../services/client/AxiosClient', () => ({
  axiosInstance: {
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() }
    }
  }
}));

// Mock the auth API
jest.mock('../services/auth_Apis');

// Mock useNavigate and useParams
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

// Helper function to render component with router
const renderForgotPassword = () => {
  return render(
    <BrowserRouter>
      <ForgotPassword />
    </BrowserRouter>
  );
};

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    (sessionStorage.getItem as jest.Mock).mockReturnValue(null);
    mockUseParams.mockReturnValue({});
  });

  test('renders forgot password form (step 1)', () => {
    renderForgotPassword();

    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset token/i })).toBeInTheDocument();
  });

  test('allows user to type in email', () => {
    renderForgotPassword();

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });


  test('renders reset password form (step 2)', () => {
    // Simulate email from sessionStorage
    sessionStorage.getItem = jest.fn().mockReturnValue('test@example.com');

    renderForgotPassword();

    expect(screen.getByText('Reset password')).toBeInTheDocument();
    expect(screen.getByLabelText(/reset token/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  test('loads email from URL params', () => {
    mockUseParams.mockReturnValue({ email_param: 'param@example.com' });

    renderForgotPassword();

    expect(screen.getByText('Reset password')).toBeInTheDocument();
    expect(screen.getByText('param@example.com')).toBeInTheDocument();
  });

  test('validates reset form fields', async () => {
    sessionStorage.getItem = jest.fn().mockReturnValue('test@example.com');

    renderForgotPassword();

    const submitButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Token is required.')).toBeInTheDocument();
      expect(screen.getByText('New password is required.')).toBeInTheDocument();
      expect(screen.getByText('Please confirm your password.')).toBeInTheDocument();
    });

    const tokenInput = screen.getByLabelText(/reset token/i);
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(tokenInput, { target: { value: '123456' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
  });

  test('handles successful password reset', async () => {
    sessionStorage.getItem = jest.fn().mockReturnValue('test@example.com');
    (resetpassword as jest.Mock).mockResolvedValue({ ok: true });

    renderForgotPassword();

    const tokenInput = screen.getByLabelText(/reset token/i);
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(tokenInput, { target: { value: '123456' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmInput, { target: { value: 'newpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(resetpassword).toHaveBeenCalledWith('test@example.com', 'newpassword', '123456');
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  test('handles resend token', async () => {
    sessionStorage.getItem = jest.fn().mockReturnValue('test@example.com');
    (forgotpassword as jest.Mock).mockResolvedValue({ ok: true });

    renderForgotPassword();

    const resendButton = screen.getByRole('button', { name: /resend token/i });
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(forgotpassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  test('shows loading states', async () => {
    (forgotpassword as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100)));

    renderForgotPassword();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset token/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Sending...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
    });
  });
});