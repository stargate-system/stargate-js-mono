import {RefObject, useEffect} from "react";

const useClickOutsideDetector = (elementRef: RefObject<HTMLElement>, onClickOutside: () => void) => {
    useEffect(() => {
        const handleClick = (ev: any) => {
            if (!elementRef?.current?.contains(ev.target)) {
                onClickOutside();
            }
        }

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elementRef]);
}

export default useClickOutsideDetector;
