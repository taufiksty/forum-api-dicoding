const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
	it('should throw error when payload did not contain needed property', () => {
		// Arrange
		const payload = {
			title: 'New Thread',
		};

		// Action and Assert
		expect(() => new NewThread(payload)).toThrowError(
			'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
		);
	});

	it('should throw error when payload did not meet data type spesification', () => {
		// Arrange
		const payload = {
			title: 'New Thread',
			body: 12345,
		};

		// Action and Assert
		expect(() => new NewThread(payload)).toThrowError(
			'NEW_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION',
		);
	});

	it('should create newThread object correctly', () => {
		// Arrange
		const payload = {
			title: 'New Thread',
			body: 'This is a new thread',
		};

		// Action
		const { title, body } = new NewThread(payload);

		// Assert
		expect(title).toEqual(payload.title);
		expect(body).toEqual(payload.body);
	});
});
