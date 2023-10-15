'use client'
import Card from "@/components/organisms/HomePage/Body/card";
import { Suspense } from 'react';
function App() {
    return ( 
    <Suspense>
 <div>
        <Card/>
    </div>
    </Suspense>
    );
}

export default App;