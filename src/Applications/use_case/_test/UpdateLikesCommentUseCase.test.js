const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UpdateLikesCommentUseCase = require('../UpdateLikesCommentUseCase');

describe('LikesCommentUseCase', () => {
	it('should orchestrating the toggle likes comment correctly', async () => {
		// Arrange
		const mockThreadRepository = new ThreadRepository();
		const mockCommentRepository = new CommentRepository();

		// Mocking
		mockThreadRepository.verifyThreadById = jest.fn(() => Promise.resolve());
		mockCommentRepository.verifyCommentById = jest.fn(() => Promise.resolve());
		mockCommentRepository.updateLikesComment = jest
			.fn()
			.mockImplementation(() => Promise.resolve());

		// Create use case instance
		const updateLikesCommentUseCase = new UpdateLikesCommentUseCase({
			commentRepository: mockCommentRepository,
			threadRepository: mockThreadRepository,
		});

		// Action
		await updateLikesCommentUseCase.execute({
			threadId: 'thread-123',
			commentId: 'comment-123',
			userId: 'user-123',
		});

		// Assert
		expect(mockThreadRepository.verifyThreadById).toBeCalledWith('thread-123');
		expect(mockCommentRepository.verifyCommentById).toBeCalledWith(
			'comment-123',
		);
		expect(mockCommentRepository.updateLikesComment).toBeCalledWith(
			'comment-123',
			'user-123',
		);
	});
});
