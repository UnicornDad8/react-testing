import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import routes from '../src/routes';
import { navigateTo } from './utils';

describe("Router", () => {
  it("should render the home page for /", () => {
    navigateTo("/");

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });  

  it("should render the products page for /products", () => {
    navigateTo("/products");

    expect(screen.getByRole("heading", { name: /products/i })).toBeInTheDocument();
  }); 
}); 