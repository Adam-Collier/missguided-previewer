import {useState} from "react"
import { inlineContent } from 'cms-javascript-sdk';

import s from "./amplience.module.css"

const Amplience = ({isSDK, sdk, data, layout, setData, setLayout}) => {
    const [amplienceId, setAmplienceId] = useState('');

    const onAmplienceIdChange = (event) => {
      setAmplienceId(event.target.value);
      console.log('event:', event.target);
    };

    const getAmplienceData = () => {
      if (!amplienceId) {
        console.log('missing amplience id');
      }

      fetch(
        `https://cdn.c1.amplience.net/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F${amplienceId}%22%7D&scope=tree&store=missguided`
      )
        .then((data) => data.json())
        .then((data) => {
          console.log('amplience data:', inlineContent(data));
          const inlinedContent = inlineContent(data);

          let allData = JSON.parse(inlinedContent[0]);
          setData(allData.data);
          setLayout(allData.layout);
        });
    };

    const saveToAmplience = () => {
      if (isSDK) {
        sdk.field.setValue(JSON.stringify({ data, layout }));
      }
    };
    
    return (
      <div className={s.amplience}>
        {!isSDK && (
          <>
            <input
              type="text"
              placeholder="Amplience content ID"
              value={amplienceId}
              onChange={onAmplienceIdChange}
            />
            <button onClick={getAmplienceData}>Get amplience data</button>
          </>
        )}
        {isSDK && (
          <button onClick={saveToAmplience}>save Changes to Amplience</button>
        )}
      </div>
    );
}

export default Amplience;