'use client'
import Card from "@/components/organisms/HomePage/Body/card";
import { CardProps } from "@/components/organisms/HomePage/Body/card";

let props: CardProps = {
    items: new Array(20).fill({name: "SpongeBob", description: "Some Stuff"})
}
import { Suspense } from 'react';
function App() {
    return ( 
    <Suspense>
 <div>
        <Card items={props.items}/>
    </div>
    </Suspense>
    );
}

export default App;