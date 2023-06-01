const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
	afterEach(async () => {
		await CommentsTableTestHelper.cleanTable();
		await ThreadsTableTestHelper.cleanTable();
		await UsersTableTestHelper.cleanTable();
	});

	afterAll(async () => {
		await pool.end();
	});

	describe('addComment function', () => {
		it('should persist new comment and return added comment correctly', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			const content = 'a new comment';
			const fakeIdGenerator = () => '123';
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);

			// Action
			await commentRepositoryPostgres.addComment(
				'user-123',
				'thread-123',
				content,
			);

			// Assert
			const comments = await CommentsTableTestHelper.findCommentsById(
				'comment-123',
			);
			expect(comments).toHaveLength(1);
		});

		it('should return added comment correctly', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			const content = 'a new comment';
			const fakeIdGenerator = () => '123';
			const commentRepositoryPostgres = new CommentRepositoryPostgres(
				pool,
				fakeIdGenerator,
			);

			// Action
			const addedComment = await commentRepositoryPostgres.addComment(
				'user-123',
				'thread-123',
				content,
			);

			// Assert
			expect(addedComment).toStrictEqual(
				new AddedComment({
					id: 'comment-123',
					content,
					owner: 'user-123',
				}),
			);
		});
	});

	describe('verifyCommentById function', () => {
		it('should throw NotFoundError if comment not available', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const commentId = 'not_found_id';

			// Action and Assert
			await expect(
				commentRepositoryPostgres.verifyCommentById(commentId),
			).rejects.toThrow(NotFoundError);
		});

		it('should not throw NotFoundError if comment available', async () => {
			// Arrange
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

			// Action and Assert
			await expect(
				commentRepositoryPostgres.verifyCommentById('comment-123'),
			).resolves.not.toThrow(NotFoundError);
		});
	});

	describe('verifyCommentOwner function', () => {
		it('should throw AuthorizationError if userId is not the owner of comment', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const commentId = 'comment-123';
			const userId = 'not_the_owner';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});

			// Action and assert
			await expect(
				commentRepositoryPostgres.verifyCommentOwner(commentId, userId),
			).rejects.toThrow(AuthorizationError);
		});

		it('should not throw AuthorizationError if userId is the owner of comment', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const commentId = 'comment-123';
			const userId = 'user-123';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});

			// Action and assert
			await expect(
				commentRepositoryPostgres.verifyCommentOwner(commentId, userId),
			).resolves.not.toThrow(AuthorizationError);
		});
	});

	describe('getCommentsByThreadId function', () => {
		it('should return comments by thread id correctly', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const threadId = 'thread-123';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});
			await CommentsTableTestHelper.addComment({
				id: 'comment-234',
				newComment: 'new comment',
				threadId: 'thread-123',
				userId: 'user-123',
				date: '2021-08-08T07:26:21.338Z',
			});
			await CommentsTableTestHelper.deleteCommentById('comment-234');

			// Action
			const getCommentsByThreadId =
				await commentRepositoryPostgres.getCommentsByThreadId(threadId);

			// Assert
			expect(getCommentsByThreadId).toEqual([
				{
					id: 'comment-123',
					username: 'dicoding',
					date: '2021-08-08T07:22:33.555Z',
					content: 'a comment',
					is_delete: '0',
				},
				{
					id: 'comment-234',
					username: 'dicoding',
					date: '2021-08-08T07:26:21.338Z',
					content: 'new comment',
					is_delete: '1',
				},
			]);
		});

		it('should return [] if comments by thread is not exist', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const threadId = 'thread-123';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});

			// Action
			const getCommentsByThreadId =
				await commentRepositoryPostgres.getCommentsByThreadId(threadId);

			// Assert
			expect(getCommentsByThreadId).toEqual([]);
		});
	});

	describe('deleteComment function', () => {
		it('should change column is_delete to value 1', async () => {
			// Arrange
			const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
			const commentId = 'comment-123';
			await UsersTableTestHelper.addUser({});
			await ThreadsTableTestHelper.addThread({});
			await CommentsTableTestHelper.addComment({});

			// Action and assert
			const isDelete = await commentRepositoryPostgres.deleteComment(commentId);
			expect(isDelete).toBe('1');
		});
	});
});
