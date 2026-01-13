import express from 'express'
import { authController } from '../controllers/authController'
import {getFilesAndFoldersById, createNewFolder} from '../controllers/filesController'
import {authenticate} from '../middleware/authenticate'
import {requirePermission} from '../middleware/permission'
export const authRouter = express.Router()

authRouter.post('/login',authController)

authRouter.post('/folder',authenticate,requirePermission('create_folder'),createNewFolder)

authRouter.get('/files',authenticate,requirePermission('view'),getFilesAndFoldersById)