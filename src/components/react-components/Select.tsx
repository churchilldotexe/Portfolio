type SelectProps = {
  selectValues: string[];
  setSelectValues: React.Dispatch<React.SetStateAction<string[]>>;
};

export function Select({}: SelectProps) {
  return <div>im a Select</div>;
}
