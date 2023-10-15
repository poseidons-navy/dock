"use client"
import { CardItemProps } from "./cardItem";

export interface CardProps {
  items: CardItemProps[]
}

import CardItem from "./cardItem";

 function Card(props: CardProps) {
    return ( 
      <div className="flex flex-row justify-center">
        <div className="flex flex-col w-4/5 items-center justify-center p-10">
          <div className="grid grid-cols-3 gap-x-10 gap-y-10 w-full">
            {
              // props.map((k, i)=>{
              //   return (
              //     <CardItem
              //       key={i}
              //       {...k}
              //     />
              //   )
              // })
              props.items.map((item, i) => {
                return <CardItem name={item.name} description={item.description} key={i}/>
              })
            }
          </div>
        </div>
      </div>
   );
 }
 
 export default Card;
  