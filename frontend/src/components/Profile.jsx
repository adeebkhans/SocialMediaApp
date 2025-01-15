import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import axios from 'axios';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import CommentDialog from './CommentDialog';
import { setSelectedPost } from '@/redux/postSlice'

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const [open, setOpen] = useState(false);
  const { userProfile, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const [isFollowing, setFollowing] = useState(user?.following.includes(userProfile?._id));
  const [followerCount, setFollowerCount] = useState(userProfile?.followers?.length || 0);

  useEffect(() => {
    setFollowerCount(userProfile?.followers?.length || 0);
  }, [userProfile?.followers]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  const FollowUnfollowHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,
        {}, 
        { withCredentials: true }
      );
      if (res.data.success) {
        setFollowing(!isFollowing);

        const updatedFollowing = isFollowing 
          ? user.following.filter((following) => following !== userProfile?._id)
          : [...user.following, userProfile?._id];

        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
        toast.success(res.data.message);

        // Adjust follower count
        setFollowerCount(prevCount => isFollowing ? prevCount - 1 : prevCount + 1);
      }
    } catch (error) {
      console.log(error)
      toast.error("An error occurred while following/unfollowing.");
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center max-w-4xl mx-auto p-6 space-y-10 w-full">
        {/* Profile Details Section */}
        <div className="flex w-full justify-between items-start gap-8">
          {/* Avatar and Username Section */}
          <div className="flex flex-col items-center w-1/3">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mt-4">{userProfile?.username}</h2>
          </div>

          {/* Info and Action Buttons Section */}
          <div className="flex-1">
            <div className="flex flex-col gap-5">
              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">Edit profile</Button>
                    </Link>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">View archive</Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">Ad tools</Button>
                  </>
                ) : (
                  isFollowing ? (
                    <>
                      <Button variant="secondary" onClick={FollowUnfollowHandler} className="h-8">Unfollow</Button>
                      <Button variant="secondary" className="h-8">Message</Button>
                    </>
                  ) : (
                    <Button onClick={FollowUnfollowHandler} className="bg-[#0095F6] hover:bg-[#3192d2] h-8">Follow</Button>
                  )
                )}
              </div>

              {/* Followers/Posts/Following */}
              <div className="flex gap-8 text-sm">
                <p><span className="font-semibold">{userProfile?.posts?.length} </span>posts</p>
                <p><span className="font-semibold">{followerCount} </span>followers</p>
                <p><span className="font-semibold">{userProfile?.following?.length} </span>following</p>
              </div>

              {/* Bio and Badge */}
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{userProfile?.bio || 'bio here...'}</span>
                <Badge className="w-fit mt-2" variant="secondary">
                  <AtSign /> <span className="pl-1">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Posts Section */}
        <div className="w-full">
          {/* Tabs */}
          <div className="flex justify-center gap-10 border-b border-gray-300 mb-4 text-sm">
            <span
              className={`cursor-pointer pb-3 ${activeTab === 'posts' ? 'font-bold border-b-2 border-black' : ''}`}
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </span>
            <span
              className={`cursor-pointer pb-3 ${activeTab === 'saved' ? 'font-bold border-b-2 border-black' : ''}`}
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </span>
            <span className="cursor-pointer pb-3">REELS</span>
            <span className="cursor-pointer pb-3">TAGS</span>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-3 gap-4">
            {displayedPost?.map((post) => (
              <div key={post?._id} className="relative group">
                <img
                  src={post?.image}
                  alt="postimage"
                  className="w-full h-full object-cover rounded-md transition-transform duration-300 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle onClick={()=>{
                        dispatch(setSelectedPost(post))
                        setOpen(true)}
                      }/>
                      <span>{post?.comments?.length}</span>
                    </button>
                  </div>
                </div>
                <CommentDialog open={open} setOpen={setOpen} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
