import { useUpdateListItemMutation } from '@/store/api';
import type { ListItem } from '@/store/api';
import DeleteItemDialog from '@/features/lists/dialogs/DeleteItemDialog';

export default function ListItem({ listItem }: { listItem: ListItem }) {
  const [updateListItem] = useUpdateListItemMutation();

  const handleToggleListItem = async (id: string, completed: boolean) => {
    await updateListItem({ id, updates: { completed: !completed } });
  };

  return (
    <div key={listItem.id} className="p-2 hover:bg-gray-50 flex items-center gap-4 border rounded-xl justify-between text-left">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={listItem.completed}
          onChange={() => handleToggleListItem(listItem.id, listItem.completed)}
          className="h-5 w-5 rounded-xl border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer "
        />
        <span className={`flex-1 ${listItem.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{listItem.title}</span>
      </div>
      <DeleteItemDialog listItem={listItem} />
    </div>
  );
}
