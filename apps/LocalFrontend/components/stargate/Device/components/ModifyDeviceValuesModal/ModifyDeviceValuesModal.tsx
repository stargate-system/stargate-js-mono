import {DeviceModel} from "gate-viewmodel";
import StandardModal from "@/components/generic/ModalComponent/StandardModal/StandardModal";
import React, {useState} from "react";
import styles from './ModifyDeviceValuesModal.module.css';
import {ValueVisibility} from "gate-core";

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
                <div className={`${styles.valueRow} ${styles.header}`}>
                    <div/>
                    <div className={styles.options}>
                        <div className={styles.optionLabel}>visible</div>
                        <div className={styles.optionLabel}>settings</div>
                        <div className={styles.optionLabel}>hidden</div>
                    </div>
                </div>
                {manifest.values.map((value) => {
                    return (
                        <div key={value.id} className={styles.valueRow}>
                            <div className={styles.label}>{value.valueName ?? `Unnamed ${value.type}`}</div>
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
