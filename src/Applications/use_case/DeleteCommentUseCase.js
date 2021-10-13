class DeleteCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        this._validateUseCasePayload(useCasePayload);
        await this._threadRepository.verifyThreadId(useCasePayload.threadId);
        await this._commentRepository.verifyOwnerComment(
            useCasePayload.commentId,
            useCasePayload.owner,
        );
        await this._commentRepository.deleteComment(useCasePayload.commentId);
    }

    _validateUseCasePayload(useCasePayload) {
        const { threadId, commentId, owner } = useCasePayload;
        if (!threadId || !commentId || !owner) {
            throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
            throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DeleteCommentUseCase;
