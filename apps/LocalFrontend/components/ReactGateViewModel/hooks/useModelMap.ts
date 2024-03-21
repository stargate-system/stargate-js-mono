import {ModelMap} from "@stargate-system/model";
import {useEffect, useState} from "react";

const useModelMap = <T>(map: ModelMap<T>) => {
    const [values, setValues] = useState<T[]>(map.values);

    useEffect(() => {
        setValues(map.values);
        const key = map.subscribe(() => {
            setValues(map.values);
        });
        return () => map.unsubscribe(key);
    }, [map]);

    return values;
}

export default useModelMap;
