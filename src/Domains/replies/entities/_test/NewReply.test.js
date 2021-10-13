const NewReply = require('../NewReply');

describe('a NewReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {};

        // Action and Assert
        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type spesification', () => {
        // Arrange
        const payload = {
            content: 123,
        };

        // Action and Assert
        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedReply object correctly', () => {
        // Arrange
        const payload = {
            content: 'test',
        };

        // Action
        const { content } = new NewReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
    });
});
