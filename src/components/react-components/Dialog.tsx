import { useRef, type ComponentProps, type ElementRef } from "react";

const handleDialog = (dialogRef: React.RefObject<HTMLDialogElement>) => {
  if (dialogRef.current) {
    if (dialogRef.current.hasAttribute("open")) {
      history.back();
      dialogRef.current.close();
    } else {
      history.pushState(null, "", "/contact");
      dialogRef.current.showModal();
    }
  }
};

export default function Dialog({ children, ...props }: ComponentProps<"dialog">) {
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  return (
    <>
      <button onClick={() => handleDialog(dialogRef)}>{children}</button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            handleDialog(dialogRef);
          }
        }}
        {...props}
      >
        <div>{children}</div>
        <button onClick={() => handleDialog(dialogRef)}>close me</button>
      </dialog>
    </>
  );
}
