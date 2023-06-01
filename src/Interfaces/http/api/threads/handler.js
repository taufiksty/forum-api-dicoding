const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ThreadsHandler {
	constructor(container) {
		this._container = container;

		this.postThreadsHandler = this.postThreadsHandler.bind(this);
		this.postCommentsByThreadIdHandler =
			this.postCommentsByThreadIdHandler.bind(this);
		this.deleteCommentsByThreadIdAndCommentIdHandler =
			this.deleteCommentsByThreadIdAndCommentIdHandler.bind(this);
		this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
		this.postRepliesByCommentIdAndThreadIdHandler =
			this.postRepliesByCommentIdAndThreadIdHandler.bind(this);
		this.deleteRepliesByReplyIdCommentIdAndThreadIdHandler =
			this.deleteRepliesByReplyIdCommentIdAndThreadIdHandler.bind(this);
	}

	async postThreadsHandler(request, h) {
		const { id: userId } = request.auth.credentials;

		const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
		const { id, title, owner } = await addThreadUseCase.execute(
			userId,
			request.payload,
		);

		const response = h.response({
			status: 'success',
			data: { addedThread: { id, title, owner } },
		});
		response.code(201);
		return response;
	}

	async postCommentsByThreadIdHandler(request, h) {
		const { id: userId } = request.auth.credentials;
		const { threadId } = request.params;

		const addCommentUseCase = this._container.getInstance(
			AddCommentUseCase.name,
		);
		const { id, content, owner } = await addCommentUseCase.execute(
			userId,
			threadId,
			request.payload.content,
		);

		const response = h.response({
			status: 'success',
			data: { addedComment: { id, content, owner } },
		});
		response.code(201);
		return response;
	}

	async postRepliesByCommentIdAndThreadIdHandler(request, h) {
		const { id: userId } = request.auth.credentials;
		const { threadId, commentId } = request.params;

		const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
		const { id, content, owner } = await addReplyUseCase.execute({
			userId,
			threadId,
			commentId,
			content: request.payload.content,
		});

		const response = h.response({
			status: 'success',
			data: { addedReply: { id, content, owner } },
		});
		response.code(201);
		return response;
	}

	async getThreadByIdHandler(request) {
		const getDetailThreadUseCase = this._container.getInstance(
			GetDetailThreadUseCase.name,
		);
		const detailThread = await getDetailThreadUseCase.execute(request.params);

		return {
			status: 'success',
			data: { thread: detailThread },
		};
	}

	async deleteCommentsByThreadIdAndCommentIdHandler(request) {
		const { id: userId } = request.auth.credentials;
		const { threadId, commentId } = request.params;

		const deleteCommentUseCase = this._container.getInstance(
			DeleteCommentUseCase.name,
		);

		await deleteCommentUseCase.execute(userId, threadId, commentId);

		return {
			status: 'success',
		};
	}

	async deleteRepliesByReplyIdCommentIdAndThreadIdHandler(request) {
		const { id: userId } = request.auth.credentials;
		const { threadId, commentId, replyId } = request.params;

		const deleteReplyUseCase = this._container.getInstance(
			DeleteReplyUseCase.name,
		);

		// eslint-disable-next-line object-curly-newline
		await deleteReplyUseCase.execute({ userId, threadId, commentId, replyId });

		return {
			status: 'success',
		};
	}
}

module.exports = ThreadsHandler;
