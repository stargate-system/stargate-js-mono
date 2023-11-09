import Device from "../Device/Device";
import {useContext} from "react";
import {DevicesImage} from "../../systemContext";

const DevicesDashboard = () => {
    const devices = useContext(DevicesImage);
    return (
        <div>
            {devices.map((manifest) => <Device manifest={manifest}/>)}
        </div>
    )
}

export default DevicesDashboard;
