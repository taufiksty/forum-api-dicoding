const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
	constructor(pool, idGenerator) {
		super();
		this._pool = pool;
		this._idGenerator = idGenerator;
	}

	async addComment(userId, threadId, newComment) {
		const id = `comment-${this._idGenerator()}`;
		const date = new Date().toISOString();

		const query = {
			text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
			values: [id, newComment, threadId, userId, date, '0'],
		};

		const result = await this._pool.query(query);

		return new AddedComment({ ...result.rows[0] });
	}

	async verifyCommentById(commentId) {
		const query = {
			text: 'SELECT * FROM comments WHERE id = $1',
			values: [commentId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError('comment tidak ditemukan');
		}
	}

	async verifyCommentOwner(commentId, userId) {
		const query = {
			text: 'SELECT owner FROM comments WHERE id = $1',
			values: [commentId],
		};

		const result = await this._pool.query(query);
		if (result.rows[0].owner !== userId) {
			throw new AuthorizationError('anda bukan pemilik comment ini');
		}
	}

	async getCommentsByThreadId(threadId) {
		const query = {
			text: 'SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete FROM comments INNER JOIN users ON users.id = comments.owner WHERE comments.thread_id = $1 ORDER BY comments.date ASC',
			values: [threadId],
		};

		const result = await this._pool.query(query);

		return result.rows;
	}

	async deleteComment(commentId) {
		const query = {
			text: "UPDATE comments SET is_delete = '1' WHERE id = $1 RETURNING is_delete",
			values: [commentId],
		};

		const result = await this._pool.query(query);

		return result.rows[0].is_delete;
	}
}

module.exports = CommentRepositoryPostgres;
