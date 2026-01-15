import express from 'express'
import { authController } from '../controllers/authController'
import {getFilesAndFoldersById, createNewFolder} from '../controllers/filesController'
import {completeSingleUpload, completeUpload, getPreSignedUrl, getSinglePresignedUrl, initiateUpload} from '../controllers/uploadController'
import {getFileViewUrl} from '../controllers/viewController'
import {authenticate} from '../middleware/authenticate'
import {requirePermission} from '../middleware/permission'
export const authRouter = express.Router()

authRouter.post('/login',authController)

authRouter.post('/folder',authenticate,requirePermission('create_folder'),createNewFolder)

authRouter.get('/files',authenticate,requirePermission('view'),getFilesAndFoldersById)

authRouter.post('/initiateUpload',authenticate,requirePermission('upload'),initiateUpload)
authRouter.post('/getPreSignedUrl',authenticate,requirePermission('upload'),getPreSignedUrl)
authRouter.post('/completeUpload',authenticate,requirePermission('upload'),completeUpload)

authRouter.post('/getSinglePresignedUrl',authenticate,requirePermission('upload'),getSinglePresignedUrl)
authRouter.post('/completeSingleUpload',authenticate,requirePermission('upload'),completeSingleUpload)


authRouter.post('/getFileViewUrl',authenticate,requirePermission('view'),getFileViewUrl)