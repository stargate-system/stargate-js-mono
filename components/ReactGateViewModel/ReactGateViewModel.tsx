import {PropsWithChildren} from "react";
import {SystemConnector} from "../SystemDashboard/api/SystemConnector";

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
