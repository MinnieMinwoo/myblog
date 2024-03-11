import useColorScheme from "logics/useColorScheme";
import SettingData from "./SettingData";

export default function ThemeEdit() {
  const { colorScheme, setColorMode, deleteColorMode } = useColorScheme();

  const dropDownButton = (
    <div className="float-end">
      <button
        className="btn btn-primary dropdown-toggle w-98px"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {colorScheme}
      </button>
      <ul className="dropdown-menu">
        <li>
          <a className="dropdown-item" onClick={() => deleteColorMode()}>
            Use Device Theme
          </a>
        </li>
        <li>
          <a className="dropdown-item" onClick={() => setColorMode("light")}>
            Light Mode
          </a>
        </li>
        <li>
          <a className="dropdown-item" onClick={() => setColorMode("dark")}>
            Dark Mode
          </a>
        </li>
      </ul>
    </div>
  );

  return (
    <SettingData
      title="Appearance"
      description="Setting applies to this browser only."
      buttonChild={dropDownButton}
      buttonMessage="Edit"
    />
  );
}
