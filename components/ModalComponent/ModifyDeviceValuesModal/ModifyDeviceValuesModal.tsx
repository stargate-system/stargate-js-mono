import {DeviceModel} from "gate-viewmodel";
import StandardModal from "../StandardModal/StandardModal";
import React, {useState} from "react";
import styles from './ModifyDeviceValuesModal.module.css';
import {Directions, ValueVisibility} from "gate-core";

interface ModifyDeviceValuesModalProps {
    deviceModel: DeviceModel
}

const ModifyDeviceValuesModal = (props: ModifyDeviceValuesModalProps) => {
    const {deviceModel} = props;
    const [manifest, setManifest] = useState(deviceModel.manifest);

    return (
        <StandardModal
            onApprove={() => deviceModel.modify(manifest)}
            approveLabel={'Save'}
            header={'Values visibility'}
        >
            <div className={styles.valuesContainer}>
                <div className={styles.valueRow}>
                    <div/>
                    <div className={styles.options}>
                        <div>visible</div>
                        <div>settings</div>
                        <div>hidden</div>
                    </div>
                </div>
                {manifest.values
                    .filter((value) => value.direction === Directions.input)
                    .map((value) => {
                    return (
                        <div key={value.id} className={styles.valueRow}>
                            {value.valueName}
                            <div className={styles.options}>
                                <input
                                    type="radio"
                                    name={value.id}
                                    value={ValueVisibility.main}
                                    checked={value.visibility === undefined || value.visibility === ValueVisibility.main}
                                    onChange={(event) => {
                                        value.visibility = event.target.value;
                                        setManifest({...manifest});
                                    }}
                                    className={styles.groupInput}
                                />
                                <input
                                    type="radio"
                                    name={value.id}
                                    value={ValueVisibility.settings}
                                    checked={value.visibility === ValueVisibility.settings}
                                    onChange={(event) => {
                                        value.visibility = event.target.value;
                                        setManifest({...manifest});
                                    }}
                                    className={styles.groupInput}
                                />
                                <input
                                    type="radio"
                                    name={value.id}
                                    value={ValueVisibility.hidden}
                                    checked={value.visibility === ValueVisibility.hidden}
                                    onChange={(event) => {
                                        value.visibility = event.target.value;
                                        setManifest({...manifest});
                                    }}
                                    className={styles.groupInput}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </StandardModal>
    );
}

export default ModifyDeviceValuesModal;
