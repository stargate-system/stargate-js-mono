import Markers from "../constants/Markers";

const appendParentId = (parentId: string, id: string) => {
    return parentId + Markers.addressSeparator + id;
}

const extractTargetId = (address: string) => {
    const separatorIndex = address.indexOf(Markers.addressSeparator);
    return [address.substring(0, separatorIndex), address.substring(separatorIndex + 1)];
}

const AddressMapper = {
    appendParentId,
    extractTargetId
}

export default AddressMapper;
