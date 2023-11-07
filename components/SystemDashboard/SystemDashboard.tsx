import {useEffect, useState} from "react";
import {Manifest, SystemConnector} from "gate-core";
import {EventName} from "gate-router";

interface SystemDashboardProps {
    connector: SystemConnector
}

const SystemDashboard = (props: SystemDashboardProps) => {
    const {connector} = props;
    const [devices, setDevices] = useState<Array<Manifest>>([]);

    const tempDevice = (manifest: Manifest) => {
        return <div>
            <span>{manifest.deviceName}</span>
        </div>
    }

    useEffect(() => {
        connector.onDeviceEvent = (event, data) => {
            switch (event) {
                case EventName.connected:
                    devices.push(data as Manifest);
                    setDevices([...devices]);
                    break;
                case EventName.disconnected:
                    setDevices(devices.filter((manifest) => manifest.id !== (data as string)));
                    break;
            }
        }
    }, [connector]);

    return (
        <div>
            <p>Test dashboard</p>
            {devices.map((manifest) => tempDevice(manifest))}
        </div>
    )
}

export default SystemDashboard;
