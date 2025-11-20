import { Router } from 'express';
import { AuthenticateUserController } from '../controllers/auth/AuthenticateUserController.js';
import { ResetPasswordController } from '../controllers/auth/ResetPasswordController.js';
import { ForgotPasswordController } from '../controllers/auth/ForgotPasswordController.js';
import { UpdateProfileController } from '../controllers/auth/UpdateProfileController.js';
import { DeleteProfileController } from '../controllers/auth/DeleteProfileController.js';
import { UploadAvatarController } from '../controllers/auth/UploadAvatarController.js';
import { upload } from '../../config/multer.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const authRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const resetPasswordController = new ResetPasswordController();
const forgotPasswordController = new ForgotPasswordController();
const updateProfileController = new UpdateProfileController();
const deleteProfileController = new DeleteProfileController();
const uploadAvatarController = new UploadAvatarController();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação e Perfil
 */

/**
 * @swagger
 * /auth/sessions:
 *   post:
 *     summary: Realiza login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *           examples:
 *             loginExample:
 *               $ref: '#/components/examples/loginExample'
 *     responses:
 *       200:
 *         description: Autenticado com sucesso — token retornado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthToken'
 *       400:
 *         description: Requisição inválida — campos obrigatórios faltando
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
authRoutes.post('/sessions', authenticateUserController.handle);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Retorna o perfil do usuário logado
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */
authRoutes.get('/profile', ensureAuthenticated, (request, response) => {
  return response.json({ message: `Bem-vindo, usuário com ID: ${request.user.id}` });
});

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Atualiza perfil
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome de exibição do usuário
 *               avatarUrl:
 *                 type: string
 *                 description: URL pública do avatar
 *           examples:
 *             updateProfileExample:
 *               $ref: '#/components/examples/updateProfileExample'
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
  *       400:
  *         description: Requisição inválida
  *       403:
  *         description: Bloqueio de alteração de nome ativo
  *       404:
  *         description: Usuário não encontrado
  *       409:
  *         description: Nome de usuário já em uso
  *       500:
  *         description: Erro interno do servidor
 */
authRoutes.put('/profile', ensureAuthenticated, updateProfileController.handle);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicita recuperação de senha
 *     tags:
 *       - Auth
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - email
  *             properties:
  *               email:
  *                 type: string
  *                 format: email
  *                 description: Email cadastrado para envio do token de recuperação
   *           examples:
   *             forgotPasswordExample:
   *               $ref: '#/components/examples/forgotPasswordExample'
 *     responses:
 *       200:
 *         description: Instruções de recuperação enviadas (mesmo se o email não existir)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericMessage'
  *       500:
  *         description: Erro interno do servidor
 */
authRoutes.post('/forgot-password', forgotPasswordController.handle);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Redefine a senha
 *     tags:
 *       - Auth
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required:
  *               - token
  *               - password
  *               - password_confirmation
  *             properties:
  *               token:
  *                 type: string
  *                 description: Token de recuperação recebido por email
  *               password:
  *                 type: string
  *                 description: Nova senha
  *               password_confirmation:
  *                 type: string
  *                 description: Confirmação da nova senha
   *           examples:
   *             resetPasswordExample:
   *               $ref: '#/components/examples/resetPasswordExample'
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericMessage'
  *       400:
  *         description: Requisição inválida — tokens ausentes, senhas não conferem ou senha fraca
  *       404:
  *         description: Token inválido ou expirado
  *       500:
  *         description: Erro interno do servidor
 */
authRoutes.post('/reset-password', resetPasswordController.handle);

/**
 * @swagger
 * /auth/profile:
 *   delete:
 *     summary: Deleta conta
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Conta deletada com sucesso (sem conteúdo)
  *       401:
  *         description: Não autenticado
  *       500:
  *         description: Erro interno do servidor
 */
authRoutes.delete('/profile', ensureAuthenticated, deleteProfileController.handle);

/**
 * @swagger
 * /auth/profile/avatar:
 *   patch:
 *     summary: Upload de avatar
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             required:
  *               - avatar
  *             properties:
  *               avatar:
  *                 type: string
  *                 format: binary
  *                 description: Arquivo de imagem do avatar (campo `avatar`)
   *           examples:
   *             avatarUploadExample:
   *               $ref: '#/components/examples/avatarUploadExample'
  *     responses:
  *       200:
  *         description: Avatar atualizado com sucesso
  *       400:
  *         description: Nenhum arquivo enviado ou arquivo inválido
  *       401:
  *         description: Não autenticado
  *       500:
  *         description: Erro interno do servidor
 */
authRoutes.patch('/profile/avatar', ensureAuthenticated, upload.single('avatar'), uploadAvatarController.handle);

export { authRoutes };