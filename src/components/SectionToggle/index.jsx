import s from "./sectiontoggle.module.css";
import { Text, Stack } from "vite-storybook";

export const SectionToggle = ({view: currentView, setView}) => {

    const handleClick = (e) => {
        setView(e.target.innerText.toLowerCase());
    }

    let viewsArr = ["Editor", "Forms"];

    return (
      <Stack direction="row" gap={0.5} className={s.wrapper}>
        {viewsArr.map((view, index) => (
          <button
            key={index}
            className={`${s.button} ${
              currentView === view.toLowerCase() ? s.active : ''
            }`}
            onClick={handleClick}
          >
            <Text size="sm">{view}</Text>
          </button>
        ))}
      </Stack>
    );
}