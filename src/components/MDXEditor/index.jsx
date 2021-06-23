import {useState, useEffect} from "react";
import {LiveEditor} from "react-live";

export const MDXEditor = ({setPreviewLayout, className}) => {
    const [layout, setLayout] = useState("");

    useEffect(() => {
      const timeOutId = setTimeout(() => {
        setPreviewLayout(layout);
        console.log('layout been set');
      }, 1000);
      return () => clearTimeout(timeOutId);
    }, [layout]);

    const handleChange = (e) => {
        setLayout(e);
    }

    return <LiveEditor className={className} onChange={handleChange} />;
}