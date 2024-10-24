
 import Post from "../post/Post.js";
import "./posts.css";

export default function Posts({ posts }) {
  
  if (!posts) {
    return <div>Loading posts...</div>; // Display a loading state
  }

  return (
    <div className="posts">
      {posts.map((p) => (
        <Post post={p} />
      ))}
    </div>
  );
}