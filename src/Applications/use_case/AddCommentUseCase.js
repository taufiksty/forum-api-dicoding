class AddCommentUseCase {
	constructor({ commentRepository, threadRepository }) {
		this._commentRepository = commentRepository;
		this._threadRepository = threadRepository;
	}

	async execute(userId, threadId, content) {
		this._validatePayload(content);

		await this._threadRepository.verifyThreadById(threadId);

		return this._commentRepository.addComment(userId, threadId, content);
	}

	_validatePayload(content) {
		if (!content) {
			throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_CONTENT');
		}

		if (typeof content !== 'string') {
			throw new Error(
				'ADD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPESIFICATION',
			);
		}
	}
}

module.exports = AddCommentUseCase;
