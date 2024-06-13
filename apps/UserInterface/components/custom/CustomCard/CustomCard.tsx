import {useContext, useMemo, useState} from "react";
import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";
import styles from './CustomCard.module.css';
import ColorPicker from "@/components/custom/ColorPicker/ColorPicker";
import {DeviceModel, DeviceSubscription} from "@stargate-system/model";

const CustomCard = () => {
    // Getting System Model
    const systemModel = useContext(SystemModelContext);

    // Creating Device Subscription
    const device = useMemo(() => {
        // Defining method to find out if given deviceModel represents device we are interested in.
        // Checking for devices tagged as 'color' on info field
        const matcher = (model: DeviceModel) => model.info.value === 'color';
        const subscription = new DeviceSubscription(systemModel, matcher);
        // Making sure deviceModel will be updated properly
        subscription.onModelUpdate = (newModel) => setDeviceModel(newModel);
        return subscription;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [deviceModel, setDeviceModel] = useState(device.deviceModel);

    return (
        <div className={styles.customCardContainer}>
            Custom Card
            {deviceModel &&
                <div className={styles.colorPickerContainer}>
                    <ColorPicker deviceModel={deviceModel}/>
                </div>
            }
        </div>
    )
}

export default CustomCard;
