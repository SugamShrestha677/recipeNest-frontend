import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import MyRecipes from "./pages/MyRecipes";
import EditProfilePage from "./pages/EditProfile";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import EditRecipePage from "./pages/EditRecipePage"; // Add this import
import SavedRecipes from "./pages/SavedRecipes"; // Add this import
import PublicRecipesPage from "./pages/PublicRecipesPage";
import PublicChefsPage from "./pages/PublicChefsPage";
import ChefDetailsPage from "./pages/ChefDetailsPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recipes" element={<PublicRecipesPage/>} />
            <Route path="/chefs" element={<PublicChefsPage/>} />
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipes/create"
              element={
                <ProtectedRoute>
                  <CreateRecipePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipes/:id"
              element={
                <ProtectedRoute>
                  <RecipeDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chefs/:id"
              element={
                <ProtectedRoute>
                  <ChefDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-recipes"
              element={
                <ProtectedRoute>
                  <MyRecipes />
                </ProtectedRoute>
              }
            />
            {/* Add edit recipe route - THIS IS IMPORTANT */}
            <Route
              path="/recipes/edit/:id"
              element={
                <ProtectedRoute>
                  <EditRecipePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-recipes"
              element={
                <ProtectedRoute>
                  <SavedRecipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
