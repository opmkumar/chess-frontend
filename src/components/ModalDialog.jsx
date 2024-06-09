import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

function ModalDialog({ open, onOpenChange, message }) {
  // const navigate = useNavigate();
  function handleOnClick() {
    console.log("hello");
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-1/2 w-[120rem]">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <p className="text-5xl text-green-800">Game Over</p>
          </DialogTitle>

          <div className="flex w-full justify-evenly py-8">
            <div className="w-16">
              <img src="./../../img/whiteKing.png" alt="white King" />
            </div>
            <div className="w-16">
              <img src="./../../img/blackKing.png" alt="black King" />
            </div>
          </div>

          <DialogDescription className="font-serif font-medium text-green-600">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={handleOnClick}
            className="mt-4 h-10 rounded bg-blue-500 px-4 text-white"
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalDialog;
