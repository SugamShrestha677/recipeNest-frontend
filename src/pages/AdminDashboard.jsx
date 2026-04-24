import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../api/adminApi';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [chefSearch, setChefSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAdminData = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const [dashboardRes, recipesRes, chefsRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getRecipes({ limit: 20, search: recipeSearch }),
        adminApi.getChefs({ limit: 20, search: chefSearch })
      ]);

      setStats(dashboardRes.data.stats);
      setRecipes(recipesRes.data.recipes || []);
      setChefs(chefsRes.data.chefs || []);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load admin dashboard';
      toast.error(message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recipeTotals = useMemo(() => {
    const published = recipes.filter((item) => item.published).length;
    return {
      all: recipes.length,
      published,
      unpublished: recipes.length - published
    };
  }, [recipes]);

  const handleToggleRecipePublish = async (recipe) => {
    try {
      await adminApi.setRecipePublishStatus(recipe._id, !recipe.published);
      toast.success(`Recipe marked as ${recipe.published ? 'unpublished' : 'published'}`);
      fetchAdminData({ silent: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update recipe visibility';
      toast.error(message);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      await adminApi.deleteRecipe(recipeId);
      toast.success('Recipe deleted');
      fetchAdminData({ silent: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to delete recipe';
      toast.error(message);
    }
  };

  const handleUpdateChefRole = async (chefId, role) => {
    try {
      await adminApi.updateChefRole(chefId, role);
      toast.success(`Chef role updated to ${role}`);
      fetchAdminData({ silent: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update role';
      toast.error(message);
    }
  };

  const handleToggleChefStatus = async (chef) => {
    try {
      await adminApi.updateChefStatus(chef._id, !chef.isActive);
      toast.success(`Chef account ${chef.isActive ? 'deactivated' : 'activated'}`);
      fetchAdminData({ silent: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update account status';
      toast.error(message);
    }
  };

  const handleDeleteChef = async (chefId) => {
    if (!window.confirm('Delete this chef and all related content? This action cannot be undone.')) {
      return;
    }

    try {
      await adminApi.deleteChef(chefId);
      toast.success('Chef deleted');
      fetchAdminData({ silent: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to delete chef';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage platform recipes and chef accounts.
            </p>
          </div>
          <button
            onClick={() => fetchAdminData({ silent: true })}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Users" value={stats?.totalUsers || 0} />
          <StatCard title="Chefs" value={stats?.totalChefs || 0} />
          <StatCard title="Admins" value={stats?.totalAdmins || 0} />
          <StatCard title="Recipes" value={stats?.totalRecipes || 0} />
          <StatCard title="Published" value={stats?.activeRecipes || 0} />
          <StatCard title="Inactive Chefs" value={stats?.inactiveChefs || 0} />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recipe Moderation</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {recipeTotals.all} | Published: {recipeTotals.published} | Unpublished: {recipeTotals.unpublished}
            </div>
          </div>

          <div className="mb-4">
            <input
              value={recipeSearch}
              onChange={(event) => setRecipeSearch(event.target.value)}
              placeholder="Search recipes by title or description"
              className="w-full md:w-96 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
            />
            <button
              onClick={() => fetchAdminData({ silent: true })}
              className="ml-0 md:ml-2 mt-2 md:mt-0 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            >
              Search
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Chef</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr key={recipe._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4 text-gray-900 dark:text-gray-100">{recipe.title}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{recipe.createdBy?.name || 'Unknown'}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${recipe.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {recipe.published ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 space-x-2">
                      <button
                        onClick={() => handleToggleRecipePublish(recipe)}
                        className="px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {recipe.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(recipe._id)}
                        className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {recipes.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-500 dark:text-gray-400">
                      No recipes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chef Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Promote, deactivate, or remove chefs</p>
          </div>

          <div className="mb-4">
            <input
              value={chefSearch}
              onChange={(event) => setChefSearch(event.target.value)}
              placeholder="Search chefs by name, email, or specialty"
              className="w-full md:w-96 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
            />
            <button
              onClick={() => fetchAdminData({ silent: true })}
              className="ml-0 md:ml-2 mt-2 md:mt-0 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            >
              Search
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Recipes</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chefs.map((chef) => (
                  <tr key={chef._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4 text-gray-900 dark:text-gray-100">{chef.name}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{chef.email}</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{chef.totalRecipes || 0}</td>
                    <td className="py-3 pr-4">  
                      <span className={`px-2 py-1 rounded text-xs font-medium ${chef.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {chef.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${chef.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {chef.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 space-x-2">
                      <button
                        onClick={() => handleUpdateChefRole(chef._id, chef.role === 'admin' ? 'chef' : 'admin')}
                        className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      >
                        {chef.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        onClick={() => handleToggleChefStatus(chef)}
                        className="px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200"
                      >
                        {chef.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteChef(chef._id)}
                        className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {chefs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-gray-500 dark:text-gray-400">
                      No chefs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  );
}

export default AdminDashboard;
