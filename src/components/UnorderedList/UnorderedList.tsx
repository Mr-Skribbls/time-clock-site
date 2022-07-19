interface iUnorderedListProps {
  listItems: unknown[];
  listBuilder: (value: any, key: number) => JSX.Element;
  className?: string;
};

const UnorderedList = ({listItems, listBuilder, className = ''}: iUnorderedListProps) => {
  const list = listItems.map(listBuilder);

  return (
    <ul className={className}>
      {list}
    </ul>
  );
};

export default UnorderedList;