import './KeyValue.css';

interface iKeyValueProps {
  k: string,
  v: string|number|null|undefined;
  classNames?: string;
}

const KeyValue = ({k, v, classNames = ''}: iKeyValueProps) => {

  return (
    <div className={`key-value ${classNames}`}>
      <span>{k}: </span>
      <span>{v}</span>
    </div>
  );

};

export default KeyValue;