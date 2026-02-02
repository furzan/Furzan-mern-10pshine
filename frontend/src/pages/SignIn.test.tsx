import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './SignIn';
import { signin } from '../services/auth_Apis';

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

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Helper function to render component with router
const renderSignIn = () => {
  return render(
    <BrowserRouter>
      <SignIn />
    </BrowserRouter>
  );
};

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  test('renders sign in form', () => {
    renderSignIn();
    
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('allows user to type in email and password', () => {
    renderSignIn();
    
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('handles successful sign in', async () => {
    const mockResponse = {
      ok: true,
      token: 'fake-jwt-token',
      user: { id: 1, email: 'test@example.com', name: 'Test User' }
    };
    
    (signin as jest.Mock).mockResolvedValue(mockResponse);
    
    renderSignIn();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(signin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(sessionStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles failed sign in', async () => {
    const mockResponse = {
      ok: false,
      message: 'Invalid credentials'
    };
    
    (signin as jest.Mock).mockResolvedValue(mockResponse);
    
    renderSignIn();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(signin).toHaveBeenCalled();
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});