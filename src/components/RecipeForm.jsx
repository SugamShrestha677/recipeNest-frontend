import React, { useState } from 'react';

function RecipeForm({ onSubmit, initialValues = {} }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [ingredients, setIngredients] = useState(
    (initialValues.ingredients && initialValues.ingredients.join(', ')) || ''
  );
  const [steps, setSteps] = useState(
    (initialValues.steps && initialValues.steps.join(', ')) || ''
  );
  const [tags, setTags] = useState((initialValues.tags && initialValues.tags.join(', ')) || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!ingredients.trim()) {
      setError('Provide at least one ingredient');
      return;
    }
    if (!steps.trim()) {
      setError('Provide at least one step');
      return;
    }
    setError('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      ingredients: ingredients.split(',').map((item) => item.trim()).filter(Boolean),
      steps: steps.split(',').map((item) => item.trim()).filter(Boolean),
      tags: tags.split(',').map((item) => item.trim()).filter(Boolean)
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}
    >
      {error && (
        <div style={{ color: '#dc2626', fontWeight: '500' }}>
          {error}
        </div>
      )}
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Grandma's Apple Pie"
          style={{
            padding: '0.6rem',
            borderRadius: '6px',
            border: '1px solid #cbd5f5'
          }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        Description
        <textarea
          value={description}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add context for your recipe."
          style={{
            padding: '0.6rem',
            borderRadius: '6px',
            border: '1px solid #cbd5f5'
          }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        Ingredients (comma separated)
        <input
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
          placeholder="Eggs, Flour, Milk"
          style={{
            padding: '0.6rem',
            borderRadius: '6px',
            border: '1px solid #cbd5f5'
          }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        Steps (comma separated)
        <input
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          required
          placeholder="Mix, Bake, Serve"
          style={{
            padding: '0.6rem',
            borderRadius: '6px',
            border: '1px solid #cbd5f5'
          }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        Tags (comma separated)
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="dessert, cozy"
          style={{
            padding: '0.6rem',
            borderRadius: '6px',
            border: '1px solid #cbd5f5'
          }}
        />
      </label>
      <button
        type="submit"
        style={{
          padding: '0.7rem 1rem',
          borderRadius: '6px',
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          fontWeight: '600'
        }}
      >
        Submit
      </button>
    </form>
  );
}

export default RecipeForm;
