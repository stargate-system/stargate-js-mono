
interface ValueDisplayInputProps {
    value: number,
    setValue: (value: number) => void
}

const ValueDisplayInput = (props: ValueDisplayInputProps) => {
    const {value, setValue} = props;

    // @ts-ignore
    return <input type='number' value={value} onInput={(ev) => setValue(ev.target.value)}/>
}

export default ValueDisplayInput;
