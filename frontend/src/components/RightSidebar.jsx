import React from 'react';
import { Link } from 'react-router-dom';

const RightSidebar = () => {
  // Placeholder trending data
  const trendingTopics = [
    { name: '#ChatGPT', shares: '100K Shares' },
    { name: '#Avengers', shares: '80K Shares' },
    { name: '#AI technology info', shares: '70K Shares' },
    { name: '#Cristiano Ronaldo', shares: '90K Shares' },
    { name: '#Elon Musk', shares: '50K Shares' },
  ];

  return (
    <aside className="space-y-4 lg:sticky lg:top-20 self-start"> {/* Adjust top based on TopNavbar height */}
      {/* Trending for you */}
      <div className="card bg-base-100 shadow-lg border border-base-300/50 p-4">
        <h3 className="text-md sm:text-lg font-semibold mb-3 text-base-content">Trending for you</h3>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index}>
              <Link to={`/search?q=${encodeURIComponent(topic.name)}`} className="link link-hover text-sm sm:text-base font-medium text-primary">
                {topic.name}
              </Link>
              <p className="text-xs text-base-content/70">{topic.shares}</p>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-outline btn-sm mt-4 w-full capitalize">Show more</button>
      </div>

      {/* Share button - as per image, could be a "What's Happening" or global action */}
      <div className="card bg-base-100 shadow-lg border border-base-300/50 p-4">
         <button className="btn btn-primary btn-block capitalize text-lg">Share</button>
      </div>

      {/* You might add other sections like "Who to follow" or ads here */}
    </aside>
  );
};

export default RightSidebar;