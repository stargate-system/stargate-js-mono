import {PropsWithChildren} from "react";
import {SystemConnector} from "gate-viewmodel/api/SystemConnector";

interface ReactGateViewModelProps extends PropsWithChildren{
    connector: SystemConnector
}

const ReactGateViewModel = (props: ReactGateViewModelProps) => {
    const {connector, children} = props;

    return (
        <>
            {children}
        </>
    )
}

export default ReactGateViewModel;
