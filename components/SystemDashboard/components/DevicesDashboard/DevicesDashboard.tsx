import Device from "../Device/Device";
import {useContext} from "react";
import {ConnectedDevices} from "../../systemContext";

const DevicesDashboard = () => {
    const devices = useContext(ConnectedDevices);
    return (
        <div>
            <p>Test dashboard</p>
            {devices.map((manifest) => <Device manifest={manifest}/>)}
        </div>
    )
}

export default DevicesDashboard;
