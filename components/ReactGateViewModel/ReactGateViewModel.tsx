import {PropsWithChildren} from "react";
import SystemModelContext from "./SystemModelContext";
import {getSystemModel} from "gate-controller";

const model = typeof window !== 'undefined' ? getSystemModel() : null;

const ReactGateViewModel = (props: PropsWithChildren) => {
    const {children} = props;

    return (
        <div>
            {model !== null &&
                <SystemModelContext.Provider value={model}>
                    {children}
                </SystemModelContext.Provider>
            }
        </div>
    )
}

export default ReactGateViewModel;
