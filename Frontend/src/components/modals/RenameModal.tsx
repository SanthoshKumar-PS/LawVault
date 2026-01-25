import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from '../ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import type { RenameItemType } from '@/types/TableTypes';
import { useFileManager } from '@/contexts/FileManagerContext';

type RenameModalType = {
    open: boolean,
    onOpenChange: (open: boolean) => void;
    renameItem: RenameItemType | null;
}

const RenameModal = ({ open, onOpenChange, renameItem }: RenameModalType) => {
    const { renameItemByType } = useFileManager();
    const [newName, setNewName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (renameItem) {
            setNewName(renameItem.name);
        }
    }, [renameItem, open]);

    const handleSubmit = async () => {
        if(!renameItem) return;
        setIsSubmitting(true);
        try {
            await renameItemByType(renameItem.id, renameItem.type, newName);
            onOpenChange(false); 
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    {/* Accessibility requirement: DialogTitle */}
                    <DialogTitle>Rename {renameItem?.type === 'file' ? 'File' : 'Folder'}</DialogTitle>
                    <DialogDescription>
                        Enter a new name for this item.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="rename-item">Name</Label>
                        <Input
                            id="rename-item"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            autoFocus
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button variant='ghost' onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={!newName.trim() || newName === renameItem?.name || isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RenameModal