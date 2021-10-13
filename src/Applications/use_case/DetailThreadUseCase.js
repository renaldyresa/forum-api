class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        this._validateUseCasePayload(useCasePayload);
        await this._threadRepository.verifyThreadId(useCasePayload.threadId);
        const detailThread = await this._threadRepository.getThreadById(useCasePayload.threadId);
        const comments = await this._commentRepository.getCommentsByThreadId(
            useCasePayload.threadId,
        );

        /* eslint-disable no-await-in-loop */
        for (const comment of comments) {
            const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
            comment.setReplies(replies);
        }
        /* eslint-enable no-await-in-loop */

        detailThread.setComments(comments);
        return detailThread;
    }

    _validateUseCasePayload(useCasePayload) {
        const { threadId } = useCasePayload;
        if (!threadId) {
            throw new Error('DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string') {
            throw new Error('DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailThreadUseCase;
