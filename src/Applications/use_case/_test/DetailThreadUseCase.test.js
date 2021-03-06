const DetailThreadUseCase = require('../DetailThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ItemComment = require('../../../Domains/comments/entities/ItemComment');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('DetailThreadUseCase', () => {
    it('should orchestrating the detail thread action correctly', async () => {
        // Arrange
        const threadId = 'thread-123';

        const expectedDetailThread = {
            id: 'thread-123',
            title: 'thread-title',
            body: 'thread-body',
            date: 'thread-date',
            username: 'thread-username',
            comments: [
                {
                    id: 'comment-123',
                    username: 'comment-username',
                    date: 'comment-date',
                    content: 'comment-content',
                    likeCount: 1,
                    replies: [
                        {
                            id: 'reply-123',
                            username: 'reply-username',
                            date: 'reply-date',
                            content: 'reply-content',
                        },
                    ],
                },
            ],
        };

        const expectedThread = new DetailThread({
            id: 'thread-123',
            title: 'thread-title',
            body: 'thread-body',
            date: 'thread-date',
            username: 'thread-username',
        });

        const expectedComments = [
            new ItemComment({
                id: 'comment-123',
                username: 'comment-username',
                date: 'comment-date',
                content: 'comment-content',
            }),
        ];

        const expectedReplies = [
            {
                id: 'reply-123',
                username: 'reply-username',
                date: 'reply-date',
                content: 'reply-content',
                comment_id: 'comment-123',
            },
        ];

        const expectedLikes = [
            {
                id: 'like-123',
                thread_id: 'thread-123',
                comment_id: 'comment-123',
                owner: 'user-123',
            },
        ];

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(expectedThread));

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository
            .getCommentsByThreadId = jest.fn(() => Promise.resolve(expectedComments));

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.getRepliesByCommentId = jest.fn(() => Promise.resolve(expectedReplies));

        const mockLikeRepository = new LikeRepository();
        mockLikeRepository.getLikesByCommentIds = jest.fn(() => Promise.resolve(expectedLikes));

        const detailThreadUseCase = new DetailThreadUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            replyRepository: mockReplyRepository,
            likeRepository: mockLikeRepository,
        });

        // Action
        const resultDetailThread = await detailThreadUseCase.execute({ threadId });

        // Assert
        expect(JSON.stringify(resultDetailThread))
            .toStrictEqual(JSON.stringify(expectedDetailThread));
        expect(mockThreadRepository.verifyThreadId).toBeCalledWith(threadId);
        expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
        expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(['comment-123']);
        expect(mockLikeRepository.getLikesByCommentIds).toBeCalledWith(['comment-123']);
    });
});
