import { LogIn, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminT } from "@/locales/translations";

const t = getAdminT();

export default function AuthButton() {
  const { user, loading, signInError, signInWithGoogle, signOut, isAuthAvailable } = useAuth();

  if (!isAuthAvailable) return null;

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled className="h-9 w-9">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (user) {
    const initial = user.email?.[0]?.toUpperCase() ?? user.displayName?.[0] ?? "?";
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL ?? undefined} alt="" />
              <AvatarFallback className="text-xs">{initial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
            {user.email ?? user.displayName ?? "Signed in"}
          </div>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => signInWithGoogle()}
        className="gap-2 h-9"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Sign in with Google</span>
      </Button>
      {signInError === "domain" && (
        <p className="text-xs text-destructive max-w-[240px] text-right">
          {t("admin_signInDomainError")}
        </p>
      )}
    </div>
  );
}
