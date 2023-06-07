class UpdateLikesCommentUseCase {
	constructor({ commentRepository, threadRepository }) {
		this._commentRepository = commentRepository;
		this._threadRepository = threadRepository;
	}

	async execute(useCasePayload) {
		const { threadId, commentId, userId } = useCasePayload;

		await this._threadRepository.verifyThreadById(threadId);
		await this._commentRepository.verifyCommentById(commentId);

		return this._commentRepository.updateLikesComment(commentId, userId);
	}
}

module.exports = UpdateLikesCommentUseCase;
