const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
    constructor(container) {
        this._container = container;
    }

    postReplyHandler = async ({ payload, auth, params }, h) => {
        const { id: owner } = auth.credentials;
        const { threadId, commentId } = params;

        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
        const addedReply = await addReplyUseCase.execute({
            ...payload, owner, threadId, commentId,
        });

        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    deleteReplyHandler = async ({ auth, params }, h) => {
        const { id: owner } = auth.credentials;
        const { threadId, commentId, replyId } = params;

        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        await deleteReplyUseCase.execute({
            threadId, commentId, replyId, owner,
        });
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = RepliesHandler;
