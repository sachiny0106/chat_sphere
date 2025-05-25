import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiUsers, FiUserPlus, FiBookmark, FiList, FiMoreHorizontal } from 'react-icons/fi'; // Example icons

const LeftSidebar = () => {
  const { authUser } = useSelector(store => store.user);

  if (!authUser) {
    return null; // Or a loading skeleton
  }

  // Placeholder data
  const followersCount = authUser.followers?.length || 1; // Replace with actual data
  const followingCount = authUser.following?.length || 2; // Replace with actual data
  const peopleYouMayKnow = [
    { id: '1', name: 'Payal', handle: '@PayalSK', avatar: `https://avatar.iran.liara.run/public/girl?username=PayalSK` },
    { id: '2', name: 'Ritesh', handle: '@RiteshKumar', avatar: `https://avatar.iran.liara.run/public/boy?username=RiteshKumar` },
  ];

  return (
    <aside className="space-y-4 lg:sticky lg:top-20 self-start"> {/* Adjust top based on TopNavbar height */}
      {/* Profile Card */}
      <div className="card bg-base-100 shadow-lg border border-base-300/50">
        <figure className="h-24 sm:h-32 bg-gradient-to-r from-primary to-secondary">
          {/* <img src={authUser.coverPhoto || "https://via.placeholder.com/400x150?text=Cover+Photo"} alt="Cover" className="w-full h-full object-cover"/> */}
        </figure>
        <div className="card-body items-center text-center p-4 -mt-12 sm:-mt-16">
          <div className="avatar">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
              <img src={authUser.profilePhoto || `https://avatar.iran.liara.run/public/boy?username=${authUser.username}`} alt={authUser.fullName} />
            </div>
          </div>
          <h2 className="card-title text-lg sm:text-xl mt-2">{authUser.fullName}</h2>
          <p className="text-sm text-base-content/70">@{authUser.username}</p>
          <p className="text-xs sm:text-sm text-base-content/80 mt-1">{authUser.bio || "Software Engineer"}</p> {/* Use actual bio */}
          <div className="flex justify-around w-full mt-4 text-xs sm:text-sm">
            <div>
              <p className="font-bold">{followersCount}</p>
              <p className="text-base-content/70">Followers</p>
            </div>
            <div>
              <p className="font-bold">{followingCount}</p>
              <p className="text-base-content/70">Following</p>
            </div>
          </div>
          <div className="card-actions mt-4">
            <Link to="/profile" className="btn btn-primary btn-sm sm:btn-md capitalize">My Profile</Link>
          </div>
        </div>
      </div>

      {/* People you may know */}
      <div className="card bg-base-100 shadow-lg border border-base-300/50 p-4">
        <h3 className="text-md sm:text-lg font-semibold mb-3 text-base-content">People you may know...</h3>
        <div className="space-y-3">
          {peopleYouMayKnow.map(person => (
            <div key={person.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full">
                    <img src={person.avatar} alt={person.name} />
                  </div>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-base-content">{person.name}</p>
                  <p className="text-xs text-base-content/70">{person.handle}</p>
                </div>
              </div>
              <button className="btn btn-outline btn-primary btn-xs sm:btn-sm capitalize">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* Add other navigation links if needed, e.g., Bookmarks, Lists */}
       {/* <div className="card bg-base-100 shadow-lg border border-base-300/50 p-4">
        <ul className="menu p-0 [&_li>*]:rounded-none">
          <li><Link to="/bookmarks"><FiBookmark className="mr-2"/> Bookmarks</Link></li>
          <li><Link to="/lists"><FiList className="mr-2"/> Lists</Link></li>
        </ul>
      </div> */}
    </aside>
  );
};

export default LeftSidebar;