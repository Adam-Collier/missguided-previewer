import {LiveEditor} from "react-live";

export const MDXEditor = ({setMDX, className}) => {

    const handleChange = (e) => {
        setMDX(e);
    }

    return <LiveEditor className={className} onChange={handleChange} />;
}