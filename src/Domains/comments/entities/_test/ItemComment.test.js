const ItemComment = require('../ItemComment');

describe('a ItemComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'test',
            username: 'test',
            date: 'test',
        };

        // Action and Assert
        expect(() => new ItemComment(payload)).toThrowError('ITEM_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 1234,
            username: 'test',
            date: 'test',
            content: '1223',
        };

        // Action and Assert
        expect(() => new ItemComment(payload)).toThrowError('ITEM_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should run checkDelete function correcly', () => {
        // Arrange
        const payload = {
            id: '1234',
            username: 'test',
            date: '1223',
            content: 'resa',
        };

        // Action
        const itemComment = new ItemComment(payload);
        itemComment.checkDeleted(true);

        // Assert
        expect(itemComment.content).toEqual('**komentar telah dihapus**');
    });

    it('should throw error when function setReplies did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: '1234',
            username: 'test',
            date: '1223',
            content: 'resa',
        };

        // Action
        const itemComment = new ItemComment(payload);

        // Assert
        expect(() => itemComment.setReplies('test')).toThrowError('ITEM_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create itemComment object and function setReplies correcly', () => {
        // Arrange
        const payload = {
            id: '1234',
            username: 'test',
            date: '1223',
            content: 'resa',
        };

        // Action
        const itemComment = new ItemComment(payload);
        itemComment.setReplies([]);

        // Assert
        expect(itemComment.id).toEqual(payload.id);
        expect(itemComment.username).toEqual(payload.username);
        expect(itemComment.date).toEqual(payload.date);
        expect(itemComment.content).toEqual(payload.content);
        expect(itemComment.replies).toEqual([]);
    });
});
