import React, {useEffect} from "react";
import {SystemModel} from "gate-viewmodel";
import LocalServerConnector from "@/service/LocalServerConnector";
import SystemDashboard from "../../../components/SystemDashboard/SystemDashboard";

const model = new SystemModel(LocalServerConnector);

const Home = () => {

    useEffect(() => {
        return () => {
            LocalServerConnector.disconnect();
        };
    }, []);

    return (
        <div>
            <SystemDashboard systemModel={model} headerContent={<div/>}/>
        </div>
    );
}

export default Home;