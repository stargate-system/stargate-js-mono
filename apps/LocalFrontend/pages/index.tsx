import {useEffect, useState} from "react";
import {SystemModel} from "gate-viewmodel";
import LocalServerConnector from "@/service/LocalServerConnector";
import SystemDashboard from "../../../components/SystemDashboard/SystemDashboard";
import {ConnectionState} from "gate-core";

const model = new SystemModel(LocalServerConnector);

const Home = () => {
    const [connectionReady, setConnectionReady] = useState(false);

    useEffect(() => {
        LocalServerConnector.addStateChangeListener((state) => {
            setConnectionReady(state === ConnectionState.ready);
        })
        return LocalServerConnector.disconnect;
    }, []);

    return (
        <div>
            {connectionReady &&
                <SystemDashboard systemModel={model} headerContent={<div/>}/>
            }
            {!connectionReady &&
                <div>Waiting for connection...</div>
            }
        </div>
    );
}

export default Home;