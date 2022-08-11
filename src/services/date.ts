const add = (date: Date) => {

  const days = (days: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  return {
    days,
  };
};

const date = (date: Date) => {
  return {
    add: add(date),
  }
}

export default date;