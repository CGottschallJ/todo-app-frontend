import type { List as IList, ListItem as IListItem } from '@/store/api';
import TodoListItem from './ListItem';
import ListHeader from './ListHeader';
import NewListItemField from './NewListItemField';

interface TodoListProps {
  list: IList;
  listItems: IListItem[];
}

export function TodoList({ list, listItems }: TodoListProps) {
  // Rendered JSX
  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border ">
      <ListHeader
        listName={list.name}
        listId={list.id}
        completedListItems={listItems.filter((item) => item.completed).length}
        incompletedListItems={listItems.filter((item) => !item.completed).length}
      />

      <div className="flex flex-col gap-2 w-full mt-2">
        {listItems
          .sort((a, b) => (a.created_at > b.created_at ? 1 : b.created_at > a.created_at ? -1 : 0))
          .map((item) => (
            <TodoListItem key={item.id} listItem={item as IListItem} />
          ))}
      </div>

      <NewListItemField listId={list.id} />
    </div>
  );
}
