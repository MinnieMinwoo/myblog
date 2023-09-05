interface Props {
  title: string;
  description: string;
  buttonMessage: string;
  onClick: () => void;
  currentData?: string;
}

export default function SettingData({ title, description, buttonMessage, onClick, currentData }: Props) {
  return (
    <div className="SettingData px-3 py-4 bb-light">
      <h3 className="d-inline-block fs-5 w-170px text-111">{title}</h3>
      <span className="text-333">{currentData}</span>
      <button className={`btn btn-primary float-end w-98px`} onClick={onClick}>
        {buttonMessage}
      </button>
      <p className="mt-2 mb-0 fs-14px text-777">{description}</p>
    </div>
  );
}
