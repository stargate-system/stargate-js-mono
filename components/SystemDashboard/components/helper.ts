import {Dispatch, SetStateAction} from "react";

export const handleSubscription = (
    targetNode: any,
    key: string | undefined,
    setKey: Dispatch<SetStateAction<any>>,
    callback: () => void,
) => {
    if (targetNode) {
        callback();
        if (key === undefined) {
            const newKey = targetNode.subscribe(callback);
            setKey(newKey)
        }
    }
    return () => {
        // @ts-ignore
        if (key && targetNode) {
            targetNode.unsubscribe(key);
        }
    }
}