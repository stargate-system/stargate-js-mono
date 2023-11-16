import {PropsWithChildren} from "react";
import {SystemModel} from "gate-viewmodel";
import SystemModelContext from "./SystemModelContext";

interface ReactGateViewModelProps extends PropsWithChildren{
    systemModel: SystemModel
}

const ReactGateViewModel = (props: ReactGateViewModelProps) => {
    const {systemModel, children} = props;

    return (
        <SystemModelContext.Provider value={systemModel}>
            {children}
        </SystemModelContext.Provider>
    )
}

export default ReactGateViewModel;
