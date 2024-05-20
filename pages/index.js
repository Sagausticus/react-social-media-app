import React, { useEffect, useState } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import PostCard from "../components/PostCard";
import PostFormCard from "../components/PostFormCard";

function Home() {
  const [posts, setPosts] = useState([]);
  const supabase = useSupabaseClient();
  const session = useSession(); // Added for later use

  const fetchPosts = async () => { // Define fetchPosts function first
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(*)') // Fetch posts and their authors
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [supabase]); // Now fetchPosts is accessible

  useEffect(() => { // Moved this useEffect down
    if (!session?.user?.id) {
      // redirect to login if not logged in 
    }
  }, [session]); 

  return (
    <div className="w-full max-w-xl mx-auto">
      <PostFormCard onPost={() => fetchPosts()} /> 
      {posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}

export default Home;

