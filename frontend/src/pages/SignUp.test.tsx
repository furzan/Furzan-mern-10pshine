import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';
import { signup } from '../services/auth_Apis';

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
const renderSignUp = () => {
  return render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );
};

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sign up form', () => {
    renderSignUp();

    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows user to type in form fields', () => {
    renderSignUp();

    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows validation errors for empty required fields', async () => {
    renderSignUp();

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required.')).toBeInTheDocument();
      expect(screen.getByText('Last name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });
  });

  test('shows validation errors for empty required fields', async () => {
    renderSignUp();

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('First name is required.')).toBeInTheDocument();
    expect(screen.getByText('Last name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  test('handles successful sign up', async () => {
    const mockResponse = {
      ok: true
    };

    (signup as jest.Mock).mockResolvedValue(mockResponse);

    renderSignUp();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        f_name: 'John',
        l_name: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  test('handles failed sign up', async () => {
    const mockResponse = {
      ok: false
    };

    (signup as jest.Mock).mockResolvedValue(mockResponse);

    renderSignUp();

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signup).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});