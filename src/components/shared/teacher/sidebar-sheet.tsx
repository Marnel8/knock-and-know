import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { AlignRight } from "lucide-react";

export function SidebarSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild></SheetTrigger>
			<SheetContent className="w-[300px] sm:w-[240px]">
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>

				<SheetFooter>
					<SheetClose asChild>] </SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
