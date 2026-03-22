import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <article
      style={{
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '1rem',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(15,23,42,0.1)'
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>{recipe.title}</h2>
        <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          {new Date(recipe.createdAt).toLocaleDateString()}
        </span>
      </header>
      <p>{recipe.description || 'No description provided.'}</p>
      <div style={{ marginBottom: '0.6rem' }}>
        {recipe.tags?.map((tag) => (
          <span
            key={tag}
            style={{
              display: 'inline-block',
              marginRight: '0.5rem',
              background: '#e0e7ff',
              color: '#312e81',
              padding: '0.1rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.8rem'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <Link to={`/recipes/${recipe._id}`} style={{ color: '#2563eb' }}>
        View details →
      </Link>
    </article>
  );
}

export default RecipeCard;
