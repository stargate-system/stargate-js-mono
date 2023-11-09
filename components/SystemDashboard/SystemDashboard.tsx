import React, {ReactElement, useEffect, useState} from "react";
import {Manifest, SystemConnector, ValueMessage} from "gate-core";
import {EventName} from "gate-router";
import {DevicesImage} from "./systemContext";
import DevicesDashboard from "./components/DevicesDashboard/DevicesDashboard";
import DeviceService from "./service/DeviceService";
import registries from "./model/registries";
import styles from './SystemDashboard.module.css';
import SystemHeader from "./components/SystemHeader/SystemHeader";

interface SystemDashboardProps {
    connector: SystemConnector,
    headerContent: ReactElement
}

const SystemDashboard = (props: SystemDashboardProps) => {
    const {connector, headerContent} = props;
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
        <div className={styles.systemDashboard}>
            <SystemHeader content={headerContent}/>
            <DevicesImage.Provider value={devices}>
                <DevicesDashboard/>
            </DevicesImage.Provider>
        </div>
    )
}

export default SystemDashboard;
