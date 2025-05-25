import React from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal } from 'react-icons/fi'; // Example icons

const PostCard = ({ post }) => {
  const { author, content, image, likes, commentsCount, timestamp } = post;

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300/50">
      <div className="card-body p-4 sm:p-5">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="avatar">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full">
                <img src={author.avatar} alt={author.name} />
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base text-base-content">{author.name}</p>
              <p className="text-xs text-base-content/70">@{author.handle} · {timestamp}</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm btn-square">
            <FiMoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Post Content */}
        {content && <p className="mb-3 text-sm sm:text-base text-base-content/90 whitespace-pre-wrap">{content}</p>}

        {/* Post Image/Video */}
        {image && (
          <figure className="mb-3 rounded-lg overflow-hidden">
            <img src={image} alt="Post content" className="w-full h-auto max-h-[500px] object-cover" />
          </figure>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between text-base-content/70">
            <div className="flex items-center gap-1 sm:gap-2">
                <button className="btn btn-ghost btn-sm text-error hover:bg-error/10">
                    <FiHeart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm ml-1">{likes}</span>
                </button>
                <button className="btn btn-ghost btn-sm hover:bg-base-300/70">
                    <FiMessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm ml-1">{commentsCount}</span>
                </button>
                <button className="btn btn-ghost btn-sm hover:bg-base-300/70">
                    <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
            {/* <p className="text-xs sm:text-sm">{likes} likes</p> */}
        </div>
      </div>
    </div>
  );
};

export default PostCard;