import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ListItem } from '@/store/api';
import { useDeleteListItemMutation } from '@/store/api';
import { FaRegTrashCan } from 'react-icons/fa6';

export default function DeleteItemDialog({ listItem }: { listItem: Partial<ListItem> }) {
  const [deleteListItem, { isLoading }] = useDeleteListItemMutation();

  const handleDelete = async () => {
    if (!listItem?.id) return;

    await deleteListItem(listItem?.id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="icon" size="icon">
          <FaRegTrashCan className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>Are you sure you want to delete this item?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
