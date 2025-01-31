import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { dark } from "@clerk/themes";

export async function Header() {
  const { sessionId } = await auth();

  return (
    <header className="border-b py-4 dark:bg-background fixed w-full">
      <div className="container mx-auto justify-between items-center flex">
        <div>NextDrive</div>
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
            <SignInButton mode="modal" />
          )}
        </div>
      </div>
    </header>
  );
}
