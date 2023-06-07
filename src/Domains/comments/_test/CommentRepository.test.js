const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
	it('should throw error when invoke unimplemented method', async () => {
		// Arrange
		const commentRepository = new CommentRepository();

		// Action and Assert
		await expect(commentRepository.addComment({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
		);
		await expect(
			commentRepository.getCommentsByThreadId(''),
		).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
		await expect(commentRepository.verifyCommentById({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
		);
		await expect(commentRepository.verifyCommentOwner({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
		);
		await expect(commentRepository.verifyLikesComment({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
		);
		await expect(commentRepository.getLikesCount('')).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
		);
		await expect(commentRepository.updateLikesComment({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
		);
		await expect(commentRepository.deleteComment({})).rejects.toThrowError(
			'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
		);
	});
});
