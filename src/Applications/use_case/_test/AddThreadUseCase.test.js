const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
	it('should orchestrating the add user action correctly', async () => {
		// Arrange
		const useCasePayload = {
			title: 'New Thread',
			body: 'This is a new thread',
		};
		const mockAddedThread = new AddedThread({
			id: 'thread-123',
			title: useCasePayload.title,
			owner: 'user-123',
		});
		const mockThreadRepository = new ThreadRepository();

		// Mocking
		mockThreadRepository.addThread = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockAddedThread));

		/** creating use case instance */
		const addThreadUseCase = new AddThreadUseCase({
			threadRepository: mockThreadRepository,
		});

		// Action
		const addedThread = await addThreadUseCase.execute(
			'user-123',
			useCasePayload,
		);

		// Assert
		expect(addedThread).toStrictEqual(
			new AddedThread({
				id: 'thread-123',
				title: useCasePayload.title,
				owner: 'user-123',
			}),
		);
		expect(mockThreadRepository.addThread).toBeCalledWith(
			'user-123',
			new NewThread({
				title: useCasePayload.title,
				body: useCasePayload.body,
			}),
		);
	});
});
