import MessageMapper from "./MessageMapper.js";
import ValueFactory from "../values/ValueFactory.js";

const deliverToInputs = (message) => {
    const changes = MessageMapper.parse(message);
    changes.forEach((entry) => {
        const [id, value] = entry;
        const receiver = ValueFactory.valuesMap[id];
        if (receiver) {
            receiver.fromString(value);
        } else {
            // TODO log delivery failure
        }
    });
}

const ValueMessages = {
    deliverToInputs
}
export default ValueMessages;