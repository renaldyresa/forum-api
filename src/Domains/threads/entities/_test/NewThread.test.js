const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'test',
        };

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type spesification', () => {
        // Arrange
        const payload = {
            title: 123,
            body: 'test',
        };

        // Action and Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedThread object correctly', () => {
        // Arrange
        const payload = {
            title: 'test-thread',
            body: 'test-body-thread',
        };

        // Action
        const { title, body } = new NewThread(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
});
