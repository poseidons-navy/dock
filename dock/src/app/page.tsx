import Card from "@/components/organisms/HomePage/Body/card";
import { CardProps } from "@/components/organisms/HomePage/Body/card";
import {Creator, Membership, getVessels} from "@/components/organisms/HomePage/helpers"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

type Vess = {
    id: string,
    name: string,
    description: string,
    chaose_channel_id: string,
    categories: string[],
    creator_id: string,
    creator: Creator,
    members: Membership[]
}
import { Suspense } from "react";
import CardItem, { CardItemProps } from '../components/organisms/HomePage/Body/cardItem';

const getPageData = async () => {
    let vessel_data = await getVessels('http://localhost:8089')

    return vessel_data.map((vessel)=> {

        return {
            name: vessel.name,
            description: vessel.description, 
            vessel_id: vessel.id,
            creator_address: vessel.creator.address

        }
    })
}


async function App() {

    
  const pageData = await getPageData()
  return (
    <Suspense>
      <div>
        <Card items={pageData} />
      </div>
    </Suspense>
  );
}

export default App;
