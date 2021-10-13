const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyOwnerComment = jest.fn(() => Promise.resolve());

        mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        await deleteCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyOwnerComment)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
    });
});
