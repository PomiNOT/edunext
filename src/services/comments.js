import { client } from "./client";
import { Comment } from "../models/comment";
import { DomainError } from "./errors";

export async function getCommentsForActivity(activityId) {
  const response = await client.get('comments', {
    params: {
      _expand: 'user',
      activityId,
      _embed: 'votes',
      parentId: -1
    }
  });

  return response.data.map((comment) => {
    const commentModel = new Comment();
    commentModel.fromObject(comment);
    return commentModel;
  });
}

export async function getChildrenComments(commentId) {
  const response = await client.get('comments', {
    params: {
      _expand: 'user',
      _embed: 'votes',
      parentId: commentId
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
      _expand: 'user',
      _embed: 'votes'
    }
  });

  const commentModel = new Comment();
  commentModel.fromObject(response.data);
  return commentModel;
}

export async function createComment(userId, activityId, content, parentId = -1) {
  const comment = new Comment();
  comment.content = content;
  comment.activityId = activityId;
  comment.date = Date.now();
  comment.userId = userId;
  comment.parentId = parentId;

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
  const children = await getChildrenComments(commentId);

  for (const child of children) {
    await deleteComment(child.id);
  }
}

export async function getVoteForUser(commentId, userId) {
  const response = await client.get("votes", {
    params: { commentId, userId }
  });

  return response.data[0];
}

export async function voteComment(commentId, userId, count) {
  const response = await client.get("votes", {
    params: { commentId, userId },
  });

  if (response.data.length > 0) {
    const existingVote = response.data[0];
    const updatedVote = {
      ...existingVote,
      count: count,
    };

    const updateResponse = await client.put(
      `votes/${existingVote.id}`,
      updatedVote
    );
    return updateResponse.data;
  } else {
    const newVote = {
      commentId,
      userId,
      count
    };

    const createResponse = await client.post("votes", newVote);
    return createResponse.data;
  }
}
