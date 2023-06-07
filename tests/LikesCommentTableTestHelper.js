/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesCommentTableTestHelper = {
	async addLikesComment({ commentId = 'comment-123', userId = 'user-123' }) {
		const query = {
			text: 'INSERT INTO likes_comment VALUES($1, $2)',
			values: [commentId, userId],
		};

		await pool.query(query);
	},
	async cleanTable() {
		await pool.query('DELETE FROM likes_comment WHERE 1=1');
	},
};

module.exports = LikesCommentTableTestHelper;
