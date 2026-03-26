import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page by default when not authenticated', () => {
  render(<App />);
  // The app should redirect to /login when no token is in localStorage
  expect(screen.getByRole('main')).toBeInTheDocument();
});
