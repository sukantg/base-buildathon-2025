import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AddProjectButton() {
  return (
    <div className="fixed bottom-6 right-6">
      <Link href="/add-project">
        <Button className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
