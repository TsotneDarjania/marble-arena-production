"use client";

import styles from "./style.module.css";
import { MouseEventHandler } from "react";

export default function Shadow({
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLDivElement>;
}) {
  return <div className={styles.shadow} onClick={onClick}></div>;
}
