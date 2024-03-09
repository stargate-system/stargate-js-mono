import React from "react";
import SystemPage from "@/components/SystemPage/SystemPage";
import dynamic from "next/dynamic";
const ReactGateViewModel = dynamic(() => import("@/components/ReactGateViewModel/ReactGateViewModel"), {ssr: false});

const Home = () => {
    return (
        <ReactGateViewModel>
            <SystemPage/>
        </ReactGateViewModel>
    );
}

export default Home;