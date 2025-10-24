import { useState } from 'react';
import { useGetTodosQuery, useCreateTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } from '@/store/api';
import { Button } from '@/components/ui/button';

interface TodoListProps {
  listId: string;
  listName: string;
  onBack: () => void;
}

export function TodoList({ listId, listName, onBack }: TodoListProps) {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { data: allTodos } = useGetTodosQuery();
  const [createTodo] = useCreateTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  // Filter todos for this list
  const todos = allTodos?.filter((todo) => todo.list_id === listId) || [];

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    await createTodo({ title: newTodoTitle, list_id: listId });
    setNewTodoTitle('');
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    await updateTodo({ id, updates: { completed: !completed } });
  };

  const handleDeleteTodo = async (id: string) => {
    if (confirm('Delete this todo?')) {
      await deleteTodo(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6">
          ← Back to Lists
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">{listName}</h1>

        {/* Create New Todo Form */}
        <form onSubmit={handleCreateTodo} className="mb-8 flex gap-4">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="New todo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit">Add Todo</Button>
        </form>

        {/* Todos List */}
        <div className="bg-white rounded-lg shadow">
          {todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No todos yet. Add your first one!</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li key={todo.id} className="p-4 hover:bg-gray-50 flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{todo.title}</span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTodo(todo.id)}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-600">
          {todos.filter((t) => t.completed).length} of {todos.length} completed
        </div>
      </div>
    </div>
  );
}
