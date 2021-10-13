const { ConvertToItemComments, ConvertToItemReplies } = require('..');
const ItemComment = require('../../../Domains/comments/entities/ItemComment');
const ItemReply = require('../../../Domains/replies/entities/ItemReply');

describe('a Utils', () => {
    it('shoud run function ConvertToItemComment to return array ItemComment and sorted by date correctly', () => {
        // Arrange
        const fakeComments = [
            {
                id: 'comment-2',
                username: 'user-123',
                date: 'date-2',
                content: 'test comment',
                is_delete: false,
            },
            {
                id: 'comment-1',
                username: 'user-123',
                date: 'date-1',
                content: 'test comment',
                is_delete: true,
            },
        ];

        const expectedComments = [
            new ItemComment({
                id: 'comment-1',
                username: 'user-123',
                date: 'date-1',
                content: '**komentar telah dihapus**',
            }),
            new ItemComment({
                id: 'comment-2',
                username: 'user-123',
                date: 'date-2',
                content: 'test comment',
            }),
        ];

        // Action
        const comments = ConvertToItemComments(fakeComments);

        // Assert
        expect(JSON.stringify(comments)).toStrictEqual(JSON.stringify(expectedComments));
    });

    it('shoud run function ConvertToItemReplies to return array ItemReply and sorted by date correctly', () => {
        // Arrange
        const fakeReplies = [
            {
                id: 'reply-2',
                username: 'user-123',
                date: 'date-2',
                content: 'test reply',
                is_delete: false,
            },
            {
                id: 'reply-1',
                username: 'user-123',
                date: 'date-1',
                content: 'test reply',
                is_delete: true,
            },
        ];

        const expectedReplies = [
            new ItemReply({
                id: 'reply-1',
                username: 'user-123',
                date: 'date-1',
                content: '**balasan telah dihapus**',
            }),
            new ItemReply({
                id: 'reply-2',
                username: 'user-123',
                date: 'date-2',
                content: 'test reply',
            }),
        ];

        // Action
        const replies = ConvertToItemReplies(fakeReplies);

        // Assert
        expect(JSON.stringify(replies)).toStrictEqual(JSON.stringify(expectedReplies));
    });
});
