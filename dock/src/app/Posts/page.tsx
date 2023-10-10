import Header from "@/components/organisms/Community/Header";
import CreatePost from "@/components/organisms/Community/createPost";
import About from "@/components/organisms/Community/About";
import Post from "@/components/organisms/Community/Posts";
function Posts() {
  return (
    <div>
      <Header />
      <div>
        <CreatePost />
        <Post />
      </div>
      <div>
        <About />
      </div>
    </div>
  );
}

export default Posts;
