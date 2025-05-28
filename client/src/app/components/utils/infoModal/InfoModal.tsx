import styles from "./style.module.css";

type Props = {
  title: string;
  text: string;
  callBack: () => void;
};
export function InfoModal({ title, text, callBack }: Props) {
  return (
    <>
      <div className={styles.shadow}></div>
      {/* Content */}
      <div className={styles.content}>
        <h2 className="title-font">{title}</h2>
        <p className="text-font">{text}</p>
        <button className="text-font" onClick={callBack}>
          Ok
        </button>
      </div>
    </>
  );
}
