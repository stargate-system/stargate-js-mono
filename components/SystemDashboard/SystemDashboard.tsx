import {useEffect, useState} from "react";
import {Manifest, SystemConnector, ValueMessage} from "gate-core";
import {EventName} from "gate-router";
import {ConnectedDevices} from "./systemContext";
import DevicesDashboard from "./components/DevicesDashboard/DevicesDashboard";
import DeviceService from "./service/DeviceService";
import registries from "./model/registries";

interface SystemDashboardProps {
    connector: SystemConnector
}

const SystemDashboard = (props: SystemDashboardProps) => {
    const {connector} = props;
    const [devices, setDevices] = useState<Array<Manifest>>([]);

    useEffect(() => {
        connector.onDeviceEvent = (event, data) => {
            switch (event) {
                case EventName.connected:
                    const manifest = data as Manifest;
                    DeviceService.handleDeviceConnected(manifest);
                    devices.push(manifest);
                    setDevices([...devices]);
                    break;
                case EventName.disconnected:
                    setDevices(devices.filter((manifest) => manifest.id !== (data as string)));
                    break;
            }
        }
        connector.onValueMessage = (changes: ValueMessage) => {
            changes.forEach((change) => {
                const registeredValue = registries.gateValuesRegistry.getByKey(change[0]);
                if (registeredValue) {
                    registeredValue.gateValue.fromRemote(change[1]);
                } else {
                    // TODO error handling
                }
            });
        }
    }, [connector]);

    return (
        <div>
            <ConnectedDevices.Provider value={devices}>
                <DevicesDashboard/>
            </ConnectedDevices.Provider>
        </div>
    )
}

export default SystemDashboard;
