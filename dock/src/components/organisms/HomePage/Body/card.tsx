"use client"

import CardItem from "./cardItem";

 function Card() {
    return ( <div className="flex flex-col w-4/5 items-center justify-center">
    <div className="grid grid-cols-3 gap-x-5 gap-y-5 w-full">
      {
        [...Array(20).fill(0)]?.map((k, i)=>{
          return (
            <CardItem
              key={i}
            />
          )
        })
      }
    </div>
  </div>
   );
 }
 
 export default Card;
  