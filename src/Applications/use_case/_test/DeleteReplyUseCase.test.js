const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: 'user-123',
        };

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

        mockReplyRepository.verifyOwnerReply = jest.fn(() => Promise.resolve());

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve());

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        await deleteReplyUseCase.execute(useCasePayload);

        // Assert
        expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.replyId);
        expect(mockReplyRepository.verifyOwnerReply)
            .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mockCommentRepository.verifyCommentId).toBeCalledWith(useCasePayload.commentId);
        expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload.threadId);
    });
});
