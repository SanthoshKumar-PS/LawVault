import { MoveItemType } from '../controllers/moveController'
export const getFilesandFolders = (itemsIds:MoveItemType[]) => {
    const folderIds:number[] = itemsIds
        .filter((item:MoveItemType)=>item.type==='folder')
        .map(item => Number(item.id));
        
    const fileIds:number[] = itemsIds
        .filter((item:MoveItemType)=>item.type==='file')
        .map(item => Number(item.id));
     return {fileIds, folderIds}
}