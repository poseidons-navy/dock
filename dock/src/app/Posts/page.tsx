import Header from "@/components/organisms/Community/Header";
import CreatePost from "@/components/organisms/Community/createPost";
import Post from "@/components/organisms/Community/Posts";
import AboutCard from "@/components/organisms/Community/AboutCard";
function Posts() {
  return (
    <div>
      <Header name={"Javascript Club"}/>
    <div className="flex justify-center">
    <div className="max-w-2xl">
        <CreatePost />
        <Post />
      </div>
      <div className="max-w-md pl-5">
        <AboutCard />
      </div>
    </div>
    </div>
  );
}

export default Posts;
