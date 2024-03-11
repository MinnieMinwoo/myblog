import useColorScheme from "logics/useColorScheme";

interface Props {
  title: string;
  description: string;
  buttonMessage: string;
  onClick?: () => void;
  currentData?: string;
  buttonChild?: React.ReactNode;
}

export default function SettingData({ title, description, buttonMessage, onClick, currentData, buttonChild }: Props) {
  const { colorScheme } = useColorScheme();

  return (
    <div className="SettingData px-3 py-4 bb-light">
      <h3 className={`d-inline-block fs-5 w-170px ${colorScheme === "dark" ? "text-eee" : "text-111"}`}>{title}</h3>
      <span className={`${colorScheme === "dark" ? "text-ccc" : "text-333"}`}>{currentData}</span>
      {buttonChild ? (
        buttonChild
      ) : (
        <button className={`btn btn-primary float-end w-98px`} onClick={onClick}>
          {buttonMessage}
        </button>
      )}
      <p className={`mt-2 mb-0 fs-14px ${colorScheme === "dark" ? "text-999" : "text-777"}`}>{description}</p>
    </div>
  );
}
