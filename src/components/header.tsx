import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { dark } from "@clerk/themes";
import SvgIcon from "./logo";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";

export async function Header() {
  const { sessionId } = await auth();

  return (
    <header className="fixed z-50 w-full border-b bg-background/50 py-3 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          <SvgIcon height={40} width={40} />
          <p>
            <span className="text-muted-foreground">next</span>
            <span className="text-emerald-500">drive</span>
          </p>
        </div>
        <div className="flex gap-2">
          {sessionId ? (
            <>
              <OrganizationSwitcher
                appearance={{
                  baseTheme: dark,
                }}
              />
              <UserButton
                appearance={{
                  baseTheme: dark,
                }}
              />
            </>
          ) : (
            <SignInButton mode="modal">
              <InteractiveHoverButton text="Sign In" />
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
