class AddReplyUseCase {
	constructor({ replyRepository, commentRepository, threadRepository }) {
		this._replyRepository = replyRepository;
		this._commentRepository = commentRepository;
		this._threadRepository = threadRepository;
	}

	async execute(useCasePayload) {
		// eslint-disable-next-line object-curly-newline
		const { userId, threadId, commentId, content } = useCasePayload;

		this._verifyPayload(content);

		await this._threadRepository.verifyThreadById(threadId);
		await this._commentRepository.verifyCommentById(commentId);

		return this._replyRepository.addReply({ userId, commentId, content });
	}

	_verifyPayload(content) {
		if (!content) {
			throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
		}

		if (typeof content !== 'string') {
			throw new Error('ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPESIFICATION');
		}
	}
}

module.exports = AddReplyUseCase;
