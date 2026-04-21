import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';

const IMAGE_BASE_URL = 'http://localhost:5000';

function resolveProfilePictureUrl(profilePicture) {
  if (!profilePicture) {
    return '';
  }

  if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
    return profilePicture;
  }

  return `${IMAGE_BASE_URL}${profilePicture.startsWith('/') ? '' : '/'}${profilePicture}`;
}

function avatarFallback(name) {
  return `https://ui-avatars.com/api/?background=ea580c&color=fff&bold=true&name=${encodeURIComponent(name || 'User')}`;
}

function CommentSection({ recipeId, comments: initialComments, onCommentAdded }) {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post(`/recipes/${recipeId}/comments`, {
        content: newComment.trim()
      });
      
      const addedComment = response.data;
      setComments((prev) => [addedComment, ...prev]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded(addedComment);
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await apiClient.post(`/comments/${commentId}/like`);
      // Update comment likes in state
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: response.data.likes }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error(error.response?.data?.message || 'Failed to like comment');
    }
  };

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {comment.user?.profilePicture ? (
                    <img
                      src={resolveProfilePictureUrl(comment.user.profilePicture)}
                      alt={comment.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = avatarFallback(comment.user?.name);
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                      {comment.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {comment.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{comment.likes?.length || 0}</span>
                </button>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.content}</p>
              
              {/* Replies (if any) */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 ml-12 space-y-2">
                  {comment.replies.map((reply, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {reply.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentSection;