const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase');

class LikesHandler {
    constructor(container) {
        this._container = container;
    }

    putLikeHandler = async({ auth, params }, h) => {
        const { id: owner } = auth.credentials;
        const { threadId, commentId } = params;

        const likeUseCase = this._container.getInstance(LikeUseCase.name);
        await likeUseCase.execute({ threadId, commentId, owner });
        
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = LikesHandler;