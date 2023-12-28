import styles from './PipesDashboard.module.css';
import {SystemModel} from "gate-viewmodel";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext, useMemo} from "react";
import ModalContext from "local-frontend/service/ModalContext";
import NewPipeModal from "./components/NewPipeModal/NewPipeModal";
import useModelMap from "../ReactGateViewModel/hooks/useModelMap";
import Pipe, {PipeProps} from "./components/Pipe/Pipe";
import {PipeValueProps} from "./components/Pipe/components/PipeValue";
import {AddressMapper} from "gate-core";

interface PipesDashboardProps {
    systemModel: SystemModel
}

interface PipeTree {
    centralValue: string,
    inputs: string[],
    outputs: string[]
}

const PipesDashboard = (props: PipesDashboardProps) => {
    const {systemModel} = props;
    const modal = useContext(ModalContext);
    const pipes = useModelMap(systemModel.pipes);

    const createModelTree = () => {
        const pipeTreesMap = new Map<string, PipeTree>();
        pipes.forEach((pipe) => {
            let currentTree = pipeTreesMap.get(pipe.source);
            if (currentTree) {
                currentTree.outputs.push(pipe.target);
            } else {
                currentTree = {
                    centralValue: pipe.source,
                    inputs: [],
                    outputs: [pipe.target]
                }
                pipeTreesMap.set(currentTree.centralValue, currentTree);
            }
            currentTree = pipeTreesMap.get(pipe.target);
            if (currentTree) {
                currentTree.inputs.push(pipe.source);
            } else {
                currentTree = {
                    centralValue: pipe.target,
                    inputs: [pipe.source],
                    outputs: []
                }
                pipeTreesMap.set(currentTree.centralValue, currentTree);
            }
        });
        const pipeTrees: PipeTree[] = [];
        pipeTreesMap.forEach((tree) => {
            if ((tree.inputs.length && tree.outputs.length) || tree.inputs.length > 1 || tree.outputs.length > 1) {
                pipeTrees.push(tree);
            }
        });
        const singlePipes = pipes.filter((pipe) => {
            return !pipeTrees.find((tree) => tree.centralValue === pipe.source || tree.centralValue === pipe.target);
        });
        return {pipeTrees, singlePipes};
    }

    const getPipeValueProps = (valueId: string): PipeValueProps | undefined => {
        const device = systemModel.devices.getById(AddressMapper.extractTargetId(valueId)[0]);
        if (device) {
            const value = device.gateValues.getById(valueId);
            if (value) {
                return {
                    deviceName: device.name.value ?? '',
                    valueName: value.name ?? '',
                    valueType: value.gateValue.type ?? ''
                }
            }
        }
        return undefined;
    }

    const pipingModel = useMemo(() => {
        const {pipeTrees, singlePipes} = createModelTree();
        const pipeModels: { key: string, props: PipeProps }[] = [];
        pipeTrees.forEach((tree) => {
            const centralValue = getPipeValueProps(tree.centralValue);
            if (centralValue) {
                const model: PipeProps = {
                    centralValue
                }
                if (tree.inputs.length) {
                    const inputs: PipeValueProps[] = [];
                    tree.inputs.forEach((input) => {
                        const value = getPipeValueProps(input);
                        if (value) {
                            inputs.push(value);
                        }
                    });
                    model.inputs = inputs;
                }
                if (tree.outputs.length) {
                    const outputs: PipeValueProps[] = [];
                    tree.outputs.forEach((output) => {
                        const value = getPipeValueProps(output);
                        if (value) {
                            outputs.push(value);
                        }
                    });
                    model.outputs = outputs;
                }
                pipeModels.push({key: tree.centralValue, props: model});
            }
        });
        singlePipes.forEach((pipe) => {
            const source = getPipeValueProps(pipe.source);
            const target = getPipeValueProps(pipe.target);
            if (source && target) {
                pipeModels.push({
                    key: pipe.source,
                    props: {
                        centralValue: source,
                        outputs: [target]
                    }
                });
            }
        });
        return pipeModels;
    }, [pipes]);

    const onAddPipe = () => {
        if (modal) {
            modal.openModal(<NewPipeModal systemModel={systemModel}/>);
        }
    }

    return (
        <div className={styles.pipesDashboard}>
            {pipingModel.map((pipeModel) =>
                <Pipe
                    key={pipeModel.key}
                    centralValue={pipeModel.props.centralValue}
                    inputs={pipeModel.props.inputs}
                    outputs={pipeModel.props.outputs}
                />
            )}
            <button className={styles.addButton} onClick={onAddPipe}>
                <FontAwesomeIcon className={styles.addIcon} icon={faPlus}/>
            </button>
        </div>
    )
}

export default PipesDashboard;
