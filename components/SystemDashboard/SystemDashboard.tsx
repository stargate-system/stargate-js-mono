import React, {ReactElement, useEffect, useState} from "react";
import {Manifest, ValueMessage} from "gate-core";
import {EventName, SystemImage} from "gate-router";
import {DevicesImage} from "./systemContext";
import DevicesDashboard from "./components/DevicesDashboard/DevicesDashboard";
import DeviceService from "./service/DeviceService";
import registries from "./model/registries";
import styles from './SystemDashboard.module.css';
import SystemHeader from "./components/SystemHeader/SystemHeader";
import {SystemConnector} from "./api/SystemConnector";
import SystemImageService from "./service/SystemImageService";
import ConnectionService from "./service/ConnectionService";

interface SystemDashboardProps {
    connector: SystemConnector,
    headerContent: ReactElement
}

const SystemDashboard = (props: SystemDashboardProps) => {
    const {connector, headerContent} = props;
    const [devicesImage, setDevicesImage] = useState<Manifest[]>([]);

    useEffect(() => {
        connector.onJoinEvent = (systemImage: SystemImage, activeDevices: string[]) => {
            setDevicesImage(systemImage.devices);
            SystemImageService.initialize(systemImage, activeDevices);
            ConnectionService.connector = connector;
        }

        connector.onDeviceEvent = (event: EventName, data: any) => {
            switch (event) {
                case EventName.connected:
                    const manifest = data as Manifest;
                    const newImage = devicesImage.filter((device) => device.id !== manifest.id);
                    newImage.push(manifest);
                    setDevicesImage(newImage);
                    DeviceService.handleDeviceConnected(manifest);
                    break;
                case EventName.disconnected:
                    DeviceService.handleDeviceDisconnected(data as string);
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

        connector.onStateChange = () => {

        }

        connector.joinSystem();
    }, [connector]);

    return (
        <div className={styles.systemDashboard}>
            <SystemHeader content={headerContent}/>
            <DevicesImage.Provider value={devicesImage}>
                <DevicesDashboard/>
            </DevicesImage.Provider>
        </div>
    )
}

export default SystemDashboard;
