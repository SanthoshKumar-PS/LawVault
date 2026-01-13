import {prisma} from './prisma'

export const getBreadcrumbs = async (folderId: number | null) => {
    const crumbs = [];
    let currentId = folderId;

    while (currentId) {
        const folder = await prisma.folder.findUnique({
            where: { id: currentId },
            select: { id: true, name: true, parentId: true }
        });

        if (!folder) break;

        crumbs.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
    }

    crumbs.unshift({ id: null, name: 'My Files' });
    return crumbs;
}