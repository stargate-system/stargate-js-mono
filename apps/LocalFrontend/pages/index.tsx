import React from "react";
import ReactGateViewModel from "../../../components/ReactGateViewModel/ReactGateViewModel";
import MainPage from "@/pages/MainPage/MainPage";

const Home = () => {
    return (
        <ReactGateViewModel>
            <MainPage/>
        </ReactGateViewModel>
    );
}

export default Home;