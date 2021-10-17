const { ConvertToItemReplies } = require('../../Commons/utils');

class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
        this._likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        this._validateUseCasePayload(useCasePayload);
        await this._threadRepository.verifyThreadId(useCasePayload.threadId);
        const detailThread = await this._threadRepository.getThreadById(useCasePayload.threadId);
        const comments = await this._commentRepository.getCommentsByThreadId(
            useCasePayload.threadId,
        );

        const commentIds = [];
        comments.forEach(comment => {
            commentIds.push(comment.id);
        });

        const replies = await this._replyRepository.getRepliesByCommentId(commentIds);
        const likes = await this._likeRepository.getLikesByCommentIds(commentIds);
        
        for (const comment of comments) {
            const repliesByCommentId = replies.filter(i =>  i.comment_id === comment.id);
            comment.setReplies(ConvertToItemReplies(repliesByCommentId));

            // comment.likeCount = likes.filter(i => i.comment_id === comment.id).length;
        }
        
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
