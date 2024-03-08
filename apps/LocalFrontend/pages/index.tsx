import React from "react";
const ReactGateViewModel = dynamic(() => import("@/components/stargate/ReactGateViewModel/ReactGateViewModel"), {ssr: false});
import SystemPage from "@/components/stargate/SystemPage/SystemPage";
import dynamic from "next/dynamic";

const Home = () => {
    return (
        <ReactGateViewModel>
            <SystemPage/>
        </ReactGateViewModel>
    );
}

export default Home;