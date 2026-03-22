import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '../components/Layout';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

describe('Layout component', () => {
  it('renders navigation links for guests', () => {
    render(
      <AuthContext.Provider value={{ user: null, logout: () => {} }}>
        <MemoryRouter>
          <Layout>
            <div>Content</div>
          </Layout>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/RecipeNest/i)).toBeDefined();
    expect(screen.getByText(/Login/i)).toBeDefined();
    expect(screen.getByText(/Register/i)).toBeDefined();
  });

  it('shows logout button when authenticated', () => {
    render(
      <AuthContext.Provider value={{ user: { name: 'Test' }, logout: () => {} }}>
        <MemoryRouter>
          <Layout>
            <div>Content</div>
          </Layout>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Logout/i)).toBeDefined();
    expect(screen.getByText(/Create/i)).toBeDefined();
  });
});
