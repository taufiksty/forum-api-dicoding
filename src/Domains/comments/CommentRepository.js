/* eslint-disable no-unused-vars */
class CommentRepository {
	async addComment(userId, threadId, newComment) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async getCommentsByThreadId(threadId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyCommentById(commentId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async verifyCommentOwner(commentId, userId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}

	async deleteComment(commentId) {
		throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
	}
}

module.exports = CommentRepository;
