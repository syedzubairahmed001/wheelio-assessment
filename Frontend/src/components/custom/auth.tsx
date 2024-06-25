import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { use, useState } from "react";

import useUserStore from "@/store/main";

export default function Auth() {
  const fetchJoinUser = useUserStore((state: any) => state.fetchJoinUser);

  const [input, setInput] = useState<string>("");
  const handleSubmit = async () => {
    let isEmail: boolean = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
      input
    );

    let email: string | null = null;
    let username: string | null = null;

    if (isEmail) {
      email = input;
      username = email.split("@")[0];
    } else {
      email = "you@you.com";
      username = input;
    }

    await fetchJoinUser({email, username});
  };

  const handleInputChange = (e: any) => {
    const val = e.target.value;

    setInput(val);
  };
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Join Our Community</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Our Community</DialogTitle>
          <DialogDescription>
            Enter your email or username to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="email-or-username" className="text-right">
              Email or Username
            </Label>
            <Input
              id="email-or-username"
              placeholder="Enter your email or username"
              className="col-span-3"
              value={input}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
