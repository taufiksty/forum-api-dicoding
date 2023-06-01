/* eslint-disable camelcase */
const Thread = require('../../Domains/threads/entities/Thread');

class GetDetailThreadUseCase {
	constructor({ threadRepository, commentRepository, replyRepository }) {
		this._threadRepository = threadRepository;
		this._commentRepository = commentRepository;
		this._replyRepository = replyRepository;
	}

	async execute(useCasePayload) {
		const { threadId } = useCasePayload;

		await this._threadRepository.verifyThreadById(threadId);
		const getThread = await this._threadRepository.getThreadById(threadId);
		const comments = await this._commentRepository.getCommentsByThreadId(
			threadId,
		);

		const commentsCheckIsDelete = comments.map((comment) => {
			const { is_delete, ...commentData } = comment;
			if (is_delete === '1') {
				return { ...commentData, content: '**komentar telah dihapus**' };
			}
			return commentData;
		});

		const commentAndReplies = await Promise.all(
			commentsCheckIsDelete.map(async (comment) => {
				const replies = await this._replyRepository.getRepliesByCommentId(
					comment.id,
				);

				if (replies.length > 0) {
					const repliesCheckIsDelete = replies.map((reply) => {
						const { is_delete, ...replyProp } = reply;
						if (is_delete === '1') {
							return { ...replyProp, content: '**balasan telah dihapus**' };
						}
						return replyProp;
					});

					return { ...comment, replies: repliesCheckIsDelete };
				}

				return { ...comment, replies };
			}),
		);

		return new Thread({
			...getThread,
			comments: commentAndReplies,
		});
	}
}

module.exports = GetDetailThreadUseCase;
