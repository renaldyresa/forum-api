class DeleteReplyUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        this._validateUseCasePayload(useCasePayload);
        await this._threadRepository.verifyThreadId(useCasePayload.threadId);
        await this._commentRepository.verifyCommentId(useCasePayload.commentId);
        await this._replyRepository.verifyOwnerReply(useCasePayload.replyId, useCasePayload.owner);
        await this._replyRepository.deleteReply(useCasePayload.replyId);
    }

    _validateUseCasePayload(useCasePayload) {
        const {
            threadId, commentId, owner, replyId,
        } = useCasePayload;
        if (!threadId || !commentId || !owner || !replyId) {
            throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string' || typeof replyId !== 'string') {
            throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DeleteReplyUseCase;
