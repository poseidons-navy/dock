"use client";
import AppBar from "./AppBar/appbar";
import WalletContextProvider from "./wallets/wallet";
import CardItem from "./Body/cardItem";
function HomePage() {
 
  return (
    <div className="flex flex-col justify-center items-center">
      <WalletContextProvider>
        <AppBar />
        {/* <div className="flex flex-col w-4/5 items-center justify-center">
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
        </div> */}
        
      </WalletContextProvider>
    </div>
  );
}

export default HomePage;
