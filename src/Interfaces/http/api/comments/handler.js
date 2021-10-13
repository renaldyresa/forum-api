const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;
    }

    postCommentHandler = async ({ payload, auth, params }, h) => {
        const { id: owner } = auth.credentials;
        const { threadId } = params;

        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const addedComment = await addCommentUseCase.execute({ ...payload, owner, threadId });

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    deleteCommentHandler = async ({ auth, params }, h) => {
        const { id: owner } = auth.credentials;
        const { threadId, commentId } = params;

        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        await deleteCommentUseCase.execute({ commentId, threadId, owner });
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = CommentsHandler;
