import React from 'react';
import RecipeForm from '../components/RecipeForm';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

function CreateRecipePage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      await apiClient.post('/recipes', payload);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Creation failed');
    }
  };

  return (
    <section>
      <h1>Create a New Recipe</h1>
      <RecipeForm onSubmit={handleSubmit} />
    </section>
  );
}

export default CreateRecipePage;
