import PostCard from "./PostCard";
import Card from "./Card";
import FriendInfo from "./FriendInfo";
import { useEffect, useState, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";

export default function ProfileContent({ activeTab, userId }) {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const supabase = useSupabaseClient();

  const loadPosts = useCallback(async () => {
    const [postsData, profileData] = await Promise.all([
      userPosts(userId),
      userProfile(userId),
    ]);
    setPosts(postsData);
    setProfile(profileData?.[0]);
  }, [userId, supabase]);

  useEffect(() => {
    if (!userId) return;
    if (activeTab === 'posts') {
      loadPosts(); 
    }
  }, [userId, activeTab, loadPosts]); 

  async function userPosts(userId) {
    const { data } = await supabase
      .from('posts')
      .select('id, content, created_at, author, photos') // Fetch photos too
      .eq('author', userId);
    return data;
  }

  async function userProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId);
    return data;
  }


  return (
    <div>
      {activeTab === 'posts' && (
        <div>
          {posts?.length > 0 && posts.map(post => (
            <PostCard key={post.created_at} {...post} profiles={profile} />
          ))}
        </div>
      )}
      {activeTab === 'about' && (
        <div>
          <Card>
            <h2 className="text-3xl mb-2">About me</h2>
            <p className="mb-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut doloremque harum maxime mollitia perferendis praesentium quaerat. Adipisci, delectus eum fugiat incidunt iusto molestiae nesciunt odio porro quae quaerat, reprehenderit, sed.</p>
            <p className="mb-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet assumenda error necessitatibus nesciunt quas quidem quisquam reiciendis, similique. Amet consequuntur facilis iste iure minima nisi non praesentium ratione voluptas voluptatem?</p>
          </Card>
        </div>
      )}
      {activeTab === 'friends' && (
        <div>
          <Card>
            <h2 className="text-3xl mb-2">Friends</h2>
            <div className="">
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
              <div className="border-b border-b-gray-100 p-4 -mx-4">
                <FriendInfo />
              </div>
            </div>
          </Card>
        </div>
      )}
  {activeTab === 'photos' && (
        <div>
          <Card>
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                  <Image
                    src={`https://source.unsplash.com/random/500x300?sig=${index}`} // More varied placeholders
                    alt={`Photo ${index + 1}`}
                    width={500} // Replace with actual image width
                    height={300} // Replace with actual image height
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      </div>
    );
  }