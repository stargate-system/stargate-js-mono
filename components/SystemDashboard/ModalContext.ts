import {createContext, ReactElement} from "react";

export interface ModalInterface {
    openModal: (content: ReactElement) => void,
    closeModal: () => void
}

const ModalContext = createContext<ModalInterface | null>(null);

export default ModalContext;
