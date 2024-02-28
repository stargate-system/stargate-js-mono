import React from "react";
import ReactGateViewModel from "@/components/stargate/ReactGateViewModel/ReactGateViewModel";
import MainPage from "@/components/stargate/MainPage/MainPage";

const Home = () => {
    return (
        <ReactGateViewModel>
            <MainPage/>
        </ReactGateViewModel>
    );
}

export default Home;