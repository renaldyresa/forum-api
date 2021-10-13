const ItemReply = require('../ItemReply');

describe('a ItemReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'test',
            username: 'test',
            date: 'test',
        };

        // Action and Assert
        expect(() => new ItemReply(payload)).toThrowError('ITEM_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
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
        expect(() => new ItemReply(payload)).toThrowError('ITEM_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
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
        const itemReply = new ItemReply(payload);
        itemReply.checkDeleted(true);

        // Assert
        expect(itemReply.content).toEqual('**balasan telah dihapus**');
    });

    it('should create itemComment object', () => {
        // Arrange
        const payload = {
            id: '1234',
            username: 'test',
            date: '1223',
            content: 'resa',
        };

        // Action
        const itemReply = new ItemReply(payload);

        // Assert
        expect(itemReply.id).toEqual(payload.id);
        expect(itemReply.username).toEqual(payload.username);
        expect(itemReply.date).toEqual(payload.date);
        expect(itemReply.content).toEqual(payload.content);
    });
});
