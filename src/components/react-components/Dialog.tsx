import { atom } from "nanostores";
import React, { useRef, useEffect, type ComponentProps, type ElementRef } from "react";
import { useStore } from "@nanostores/react";

const dialogState = atom<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

// Helper functions to manipulate the dialog state
const openDialog = (id: string) => dialogState.set({ isOpen: true, id });
const closeDialog = () => dialogState.set({ isOpen: false, id: null });

// DialogButton component
export function DialogButton({
  children,
  dialogId,
  ...props
}: ComponentProps<"button"> & { dialogId: string }) {
  const handleClick = () => {
    const { isOpen, id } = dialogState.get();
    if (isOpen && id === dialogId) {
      closeDialog();
      history.back();
    } else {
      openDialog(dialogId);
      history.pushState(null, "", "/contact");
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

// Dialog component
export function Dialog({ children, id, ...props }: ComponentProps<"dialog"> & { id: string }) {
  const dialogRef = useRef<ElementRef<"dialog">>(null);
  const { isOpen, id: openDialogId } = useStore(dialogState);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen && openDialogId === id) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen, openDialogId, id]);

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.currentTarget === e.target) {
      closeDialog();
      history.back();
    }
  };

  return (
    <dialog id={id} ref={dialogRef} onClick={handleDialogClick} {...props}>
      <div>{children}</div>
      <DialogButton dialogId={id}>close me</DialogButton>
    </dialog>
  );
}
