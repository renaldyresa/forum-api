const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        this._validateUseCasePayload(useCasePayload);
        await this._threadRepository.verifyThreadId(useCasePayload.threadId);
        const newComment = new NewComment(useCasePayload);
        return this._commentRepository.addComment(
            newComment,
            useCasePayload.threadId,
            useCasePayload.owner,
        );
    }

    _validateUseCasePayload(useCasePayload) {
        const { threadId } = useCasePayload;
        if (!threadId) {
            throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_THEAD_ID');
        }

        if (typeof threadId !== 'string') {
            throw new Error('ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddCommentUseCase;
