import React, { useState } from 'react';
import useFetchRecipes from '../hooks/useFetchRecipes';
import RecipeCard from '../components/RecipeCard';
import RecipeForm from '../components/RecipeForm';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, error, loading, reload } = useFetchRecipes({
    search: query,
    limit: 12
  });
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    try {
      setIsSubmitting(true);
      await apiClient.post('/recipes', payload);
      reload();
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to create recipe';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>My Recipes</h1>
          <button
            onClick={() => navigate('/recipes/create')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: '#6366f1',
              color: '#fff'
            }}
          >
            + New Recipe
          </button>
        </div>
        <input
          value={query}
          placeholder="Search by title, tag, or description"
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem',
            borderRadius: '6px',
            border: '1px solid #cbd5f5',
            marginTop: '1rem'
          }}
        />
      </section>
      {loading ? (
        <p>Loading recipes...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : data?.recipes?.length === 0 ? (
        <p>No recipes found yet.</p>
      ) : (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1rem'
          }}
        >
          {data.recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </section>
      )}
      <section>
        <h2>Quick Add</h2>
        <p>Use this form to add a simple recipe without leaving the page.</p>
        <RecipeForm
          onSubmit={handleCreate}
          initialValues={{
            tags: ['quick', 'freestyle']
          }}
        />
        {isSubmitting && <p>Submitting...</p>}
      </section>
    </div>
  );
}

export default HomePage;
