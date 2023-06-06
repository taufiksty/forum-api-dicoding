/* eslint-disable camelcase */

exports.up = (pgm) => {
	pgm.createTable('likes_comment', {
		comment_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		user_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
	});

	pgm.addConstraint(
		'likes_comment',
		'fk_likes_comment.comment_id_comments.id',
		'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
	);

	pgm.addConstraint(
		'likes_comment',
		'fk_replies.user_id_users.id',
		'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
	);
};

exports.down = (pgm) => {
	pgm.dropTable('likes_comment');
};
