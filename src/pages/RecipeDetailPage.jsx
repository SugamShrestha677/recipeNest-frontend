import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let isActive = true;
    const fetchRecipe = async () => {
      try {
        const res = await apiClient.get(`/recipes/${id}`);
        if (isActive) {
          setRecipe(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load recipe');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };
    fetchRecipe();
    return () => {
      isActive = false;
    };
  }, [id]);

  if (loading) {
    return <p>Loading recipe...</p>;
  }

  if (error || !recipe) {
    return (
      <div>
        <p style={{ color: '#dc2626' }}>{error || 'Recipe not found'}</p>
        <Link to="/">Go back</Link>
      </div>
    );
  }

  return (
    <section
      style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '10px',
        border: '1px solid #e5e7eb'
      }}
    >
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Steps</h3>
          <ol>
            {recipe.steps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
      <div>
        <h4>Tags</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: '#e0e7ff',
                color: '#312e81',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <Link to="/" style={{ color: '#2563eb' }}>
        ← Back to recipes
      </Link>
    </section>
  );
}

export default RecipeDetailPage;
