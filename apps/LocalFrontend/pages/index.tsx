import React from "react";
import ReactGateViewModel from "@/components/stargate/ReactGateViewModel/ReactGateViewModel";
import SystemPage from "@/components/stargate/SystemPage/SystemPage";

const Home = () => {
    return (
        <ReactGateViewModel>
            <SystemPage/>
        </ReactGateViewModel>
    );
}

export default Home;