import { render, screen } from '@testing-library/react';
import { mockAuthState } from '../utils';
import AuthStatus from '../../src/components/AuthStatus';

describe("AuthStatus", () => {
  it("should render the loading message while fetching the auth status", () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined
    });

    render(<AuthStatus />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  }); 

  it("should render the login button if the user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined
    });

    render(<AuthStatus />); 

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /log out/i })).not.toBeInTheDocument();
  });

  it("should render the user name if authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name: "Ceci" }
    });

    render(<AuthStatus />);

    expect(screen.getByText(/ceci/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /log in/i })).not.toBeInTheDocument();
  });
});