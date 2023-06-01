const AddCommentUseCase = require('../AddCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
	it('should throw error if use case payload not contain content', async () => {
		// Arrange
		const useCasePayload = { userId: 'user-123', threadId: 'thread-123' };
		const addCommentUseCase = new AddCommentUseCase({});

		// Action & Assert
		await expect(
			addCommentUseCase.execute(useCasePayload.userId, useCasePayload.threadId),
		).rejects.toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT');
	});

	it('should throw error if contain not a string', async () => {
		// Arrange
		const useCasePayload = {
			userId: 'user-123',
			threadId: 'thread-123',
			content: 123,
		};
		const addCommentUseCase = new AddCommentUseCase({});

		// Action & Assert
		await expect(
			addCommentUseCase.execute(
				useCasePayload.userId,
				useCasePayload.threadId,
				useCasePayload.content,
			),
		).rejects.toThrowError(
			'ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPESIFICATION',
		);
	});

	it('should orchestrating the add comment action correctly', async () => {
		// Arrange
		const useCasePayload = {
			content: 'a Comment',
		};
		const mockAddedComment = new AddedComment({
			id: 'comment-123',
			content: useCasePayload.content,
			owner: 'user-123',
		});
		const mockCommentRepository = new CommentRepository();
		const mockThreadRepository = new ThreadRepository();

		// Mocking
		mockThreadRepository.verifyThreadById = jest
			.fn()
			.mockImplementation(() => Promise.resolve());
		mockCommentRepository.addComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve(mockAddedComment));

		// create use case instance
		const addCommentUseCase = new AddCommentUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		});

		// Action
		const addedComment = await addCommentUseCase.execute(
			'user-123',
			'thread-123',
			useCasePayload.content,
		);

		// Assert
		expect(addedComment).toEqual(
			new AddedComment({
				id: 'comment-123',
				content: useCasePayload.content,
				owner: 'user-123',
			}),
		);
		expect(mockThreadRepository.verifyThreadById).toBeCalledWith('thread-123');
		expect(mockCommentRepository.addComment).toBeCalledWith(
			'user-123',
			'thread-123',
			useCasePayload.content,
		);
	});
});
