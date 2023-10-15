"use client"

import CardItem from "./cardItem";

 function Card() {
    return ( 
      <div className="flex flex-row justify-center">
        <div className="flex flex-col w-4/5 items-center justify-center p-10">
          <div className="grid grid-cols-3 gap-x-10 gap-y-10 w-full">
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
      </div>
   );
 }
 
 export default Card;
  