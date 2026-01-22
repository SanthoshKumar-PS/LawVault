import express from 'express'
import { authController } from '../controllers/authController'
import {getFilesAndFoldersById, createNewFolder} from '../controllers/filesController'
import {completeSingleUpload, completeUpload, getPreSignedUrl, getSinglePresignedUrl, initiateUpload} from '../controllers/uploadController'
import { getFileViewUrl, getFileDownloadUrl } from '../controllers/viewController'
import {getRecentsFiles} from '../controllers/recentsController'
import { getUserWithPermissions, updateUserPermissions } from '../controllers/userController'
import {getFoldersUnderFolderId, moveFoldersToTargetId} from '../controllers/moveController'
import {authenticate} from '../middleware/authenticate'
import {requirePermission} from '../middleware/permission'
import {requireAdminPermission} from '../middleware/adminPermission'
export const authRouter = express.Router()

authRouter.post('/login',authController)
authRouter.get('/user/access', authenticate, requireAdminPermission(),getUserWithPermissions)
authRouter.put('/user/permissions', authenticate,requireAdminPermission(),updateUserPermissions)

authRouter.post('/folder',authenticate,requirePermission('create_folder'),createNewFolder)

authRouter.get('/files',authenticate,requirePermission('view'),getFilesAndFoldersById)

authRouter.post('/initiateUpload',authenticate,requirePermission('upload'),initiateUpload)
authRouter.post('/getPreSignedUrl',authenticate,requirePermission('upload'),getPreSignedUrl)
authRouter.post('/completeUpload',authenticate,requirePermission('upload'),completeUpload)

authRouter.post('/getSinglePresignedUrl',authenticate,requirePermission('upload'),getSinglePresignedUrl)
authRouter.post('/completeSingleUpload',authenticate,requirePermission('upload'),completeSingleUpload)


authRouter.post('/getFileViewUrl',authenticate,requirePermission('view'),getFileViewUrl);

authRouter.post('/getFileDownloadUrl',authenticate,requirePermission('download'),getFileDownloadUrl);



// Move Files Routes
authRouter.get('/folderNamesById', authenticate, requirePermission('move'), getFoldersUnderFolderId)
authRouter.get('/moveFoldersToTargetId', authenticate, requirePermission('move'), moveFoldersToTargetId)


// Recents Files
authRouter.get('/files/recents', authenticate, requirePermission('view'), getRecentsFiles)