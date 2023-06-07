const routes = (handler) => [
	{
		method: 'POST',
		path: '/threads',
		handler: handler.postThreadsHandler,
		options: {
			auth: 'forumapi_jwt',
		},
	},
	{
		method: 'GET',
		path: '/threads/{threadId}',
		handler: handler.getThreadByIdHandler,
	},
	{
		method: 'POST',
		path: '/threads/{threadId}/comments',
		handler: handler.postCommentsByThreadIdHandler,
		options: {
			auth: 'forumapi_jwt',
		},
	},
	{
		method: 'DELETE',
		path: '/threads/{threadId}/comments/{commentId}',
		handler: handler.deleteCommentsByThreadIdAndCommentIdHandler,
		options: {
			auth: 'forumapi_jwt',
		},
	},
	{
		method: 'POST',
		path: '/threads/{threadId}/comments/{commentId}/replies',
		handler: handler.postRepliesByCommentIdAndThreadIdHandler,
		options: {
			auth: 'forumapi_jwt',
		},
	},
	{
		method: 'DELETE',
		path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
		handler: handler.deleteRepliesByReplyIdCommentIdAndThreadIdHandler,
		options: {
			auth: 'forumapi_jwt',
		},
	},
	{
		method: 'PUT',
		path: '/threads/{threadId}/comments/{commentId}/likes',
		handler: handler.putLikesCommentHandler,
		options: {
			auth: 'forumapi_jwt',
		},
	},
];

module.exports = routes;
