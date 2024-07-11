import { client } from "./client";
import { Comment } from "../models/comment";
import { DomainError } from "./errors";

export async function getCommentsForActivity(activityId) {
  const response = await client.get('comments', {
    params: {
      _expand: 'user',
      activityId
    }
  });

  return response.data.map((comment) => {
    const commentModel = new Comment();
    commentModel.fromObject(comment);
    return commentModel;
  });
}

export async function getCommentById(commentId) {
  const response = await client.get(`comments/${commentId}`, {
    params: {
      _expand: 'user'
    }
  });

  const commentModel = new Comment();
  commentModel.fromObject(response.data);
  return commentModel;
}

export async function createComment(userId, activityId, content) {
  const comment = new Comment();
  comment.content = content;
  comment.activityId = activityId;
  comment.date = Date.now();
  comment.userId = userId;
  comment.votes = 0;

  const response = await client.post('comments', comment.toObject());
  return getCommentById(response.data.id);
}

export async function editComment(commentId, content) {
  const comment = await getCommentById(commentId);
  comment.content = content;
  await client.put(`comments/${commentId}`, comment.toObject());
  return getCommentById(commentId);
}

export async function deleteComment(commentId) {
  await client.delete(`comments/${commentId}`);
}
