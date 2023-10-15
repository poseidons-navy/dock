"use client";
import AppBar from "./AppBar/appbar";
import WalletContextProvider from "./wallets/wallet";
function HomePage() {
 
  return (
    <div className="flex flex-col justify-center items-center bg-slate-900 py-4">
      <WalletContextProvider>
        <AppBar />
      </WalletContextProvider>
    </div>
  );
}

export default HomePage;
