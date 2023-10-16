import Header from "@/components/organisms/Community/Header";
import CreatePost from "@/components/organisms/Community/createPost";
import Post from "@/components/organisms/Community/Posts";
import AboutCard from "@/components/organisms/Community/AboutCard";
import Poll from "@/components/organisms/Community/Poll";

function Posts() {








  
  return (
    <div>
      <Header name={"Javascript Club"}/>
    <div className="flex justify-center  ">
    <div className="max-w-full ">
        <CreatePost />
        {/* <Post /> */}
        <Poll 
          question={"Who is Better Chrisitiano Or Messi"}
          choices={[
            "Messi",
            "Ronaldo"
          ]}
          for={75}
          against={25}
          vesselId={}
        />
      </div>
      <div className=" max-w-sm  ml-5">
        <AboutCard />
      </div>
    </div>
    </div>
  );
}

export default Posts;
