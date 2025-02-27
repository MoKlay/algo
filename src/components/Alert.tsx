import classNames from "classnames";
import React, { useEffect, useState } from "react";
// Типизация для компонента Alert
export enum TypeAlert{
  Success = 'success',
  Error = 'error',
  Warning = 'warning'
}

interface AlertProps {
  type: TypeAlert
  message: string;
  onClose: () => void;
  closing?: boolean
}


// Компонент Alert (просто для примера)
function Alert({ type ,message, onClose, closing }: AlertProps): React.JSX.Element {

  

  return (
    <div className={classNames('alert', type, {closing})} onAnimationEndCapture={e => closing && onClose()}>
      {message}
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
}

type Alert = [
  React.JSX.Element | null,
  (type:TypeAlert,message:string) => void
];

export default function useAlert() : Alert {
  const [message, setMessage] = useState<string>();
  const [type, setType] = useState<TypeAlert>(TypeAlert.Success);
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    let timeClose:NodeJS.Timeout;
    if (message) timeClose = setTimeout(onClose, 3000)

    return () => {
      clearTimeout(timeClose)
    }
  }, [message])

  
  function onClose() {
    if (!closing) {
      setClosing(true)
      return
    }
    setMessage(undefined);
    setClosing(false)
  }
  function openAlert(type:TypeAlert ,message:string) {
    setType(type)
    setMessage(message)
  }
  return [
    message ? <Alert type={type} message={message} onClose={onClose} closing={closing}/> : null,
    openAlert,
  ];
}
