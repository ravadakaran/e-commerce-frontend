import React, { useEffect, useState } from 'react';

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ categoryName: '', status: 'active' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    if (!newCategory.categoryName?.trim()) {
      alert('Category name is required');
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) throw new Error('Failed to create');
      const created = await res.json();
      setCategories([...categories, created]);
      setNewCategory({ categoryName: '', status: 'active' });
      alert('Category created');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editCategory?.id || !editCategory.categoryName?.trim()) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/categories/${editCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: editCategory.categoryName, status: editCategory.status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setCategories(categories.map((c) => (c.id === editCategory.id ? updated : c)));
      setEditCategory(null);
      alert('Category updated');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setCategories(categories.filter((c) => c.id !== id));
      alert('Category deleted');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-light mb-6">Manage Categories</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Add Category</h2>
          <div className="flex gap-3">
            <input
              value={newCategory.categoryName}
              onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
              placeholder="Category name"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
            />
            <select
              value={newCategory.status}
              onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{cat.categoryName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${cat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditCategory(cat)}
                      className="text-amber-600 hover:text-amber-700 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditCategory(null)}>
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-medium mb-4">Edit Category</h2>
              <input
                value={editCategory.categoryName}
                onChange={(e) => setEditCategory({ ...editCategory, categoryName: e.target.value })}
                placeholder="Category name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3"
              />
              <select
                value={editCategory.status}
                onChange={(e) => setEditCategory({ ...editCategory, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex gap-2">
                <button onClick={handleUpdate} disabled={isLoading} className="flex-1 py-2 bg-amber-500 text-white rounded-lg">
                  Update
                </button>
                <button onClick={() => setEditCategory(null)} className="flex-1 py-2 border border-gray-200 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesAdmin;
