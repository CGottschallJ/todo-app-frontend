import { useState } from 'react';
import { useGetListsQuery, useCreateListMutation, useGetListItemsQuery } from '@/store/api';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { supabase } from '@/lib/supabase';
import { TodoList } from './list/List';

export function TodoDashboard() {
  const [newListName, setNewListName] = useState('');
  const { data: lists, isLoading } = useGetListsQuery();
  const [createList] = useCreateListMutation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const { data: listItems } = useGetListItemsQuery();

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    await createList({ name: newListName });
    setNewListName('');
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

        <div className="grid grid-cols-3 gap-4">
          {lists?.map((list) => (
            <TodoList key={list.id} list={list} listItems={listItems?.filter((item) => item.list_id === list.id) || []} />
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
