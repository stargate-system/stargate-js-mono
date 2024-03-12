import {ModelValue} from "gate-viewmodel";
import {useEffect, useState} from "react";

const useModelValue = <T>(modelValue?: ModelValue<T>) => {
    const [value, setValue] = useState<T | undefined>(modelValue?.value);

    useEffect(() => {
        setValue(modelValue?.value);
        const key = modelValue?.subscribe(() => {
            setValue(modelValue.value);
        });

        return () => {
            if (key && modelValue) {
                modelValue.unsubscribe(key);
            }
        };
    }, [modelValue]);

    return value;
}

export default useModelValue;
