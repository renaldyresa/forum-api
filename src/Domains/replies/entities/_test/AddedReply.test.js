const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'test',
            content: 'test',
        };

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 1234,
            content: 'test',
            owner: {},
        };

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            content: 'test-thread',
            owner: 'user-123',
        };

        // Action
        const addedReply = new AddedReply(payload);

        // Assert
        expect(addedReply.id).toEqual(payload.id);
        expect(addedReply.content).toEqual(payload.content);
        expect(addedReply.owner).toEqual(payload.owner);
    });
});
