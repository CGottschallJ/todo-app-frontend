import { useState } from 'react';
import { useGetListsQuery, useCreateListMutation, useDeleteListMutation } from '@/store/api';
import { Button } from '@/components/ui/button';
import { TodoList } from './TodoList';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { supabase } from '@/lib/supabase';

export function TodoDashboard() {
  const [newListName, setNewListName] = useState('');
  const { data: lists, isLoading } = useGetListsQuery();
  const [createList] = useCreateListMutation();
  const [deleteList] = useDeleteListMutation();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    await createList({ name: newListName });
    setNewListName('');
  };

  const handleDeleteList = async (id: string) => {
    if (confirm('Delete this list and all its todos?')) {
      await deleteList(id);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // If a list is selected, show TodoList component
  if (selectedListId) {
    return <TodoList listId={selectedListId} listName={lists?.find((l) => l.id === selectedListId)?.name || ''} onBack={() => setSelectedListId(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Todo Lists</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Create New List Form */}
        <form onSubmit={handleCreateList} className="mb-8 flex gap-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit">Create List</Button>
        </form>

        {/* Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists?.map((list) => (
            <div key={list.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition" onClick={() => setSelectedListId(list.id)}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{list.name}</h2>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteList(list.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {lists?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No lists yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
