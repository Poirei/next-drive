import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function Header() {
  return (
    <header className="border-b py-4 dark:bg-background fixed w-full">
      <div className="container mx-auto justify-between items-center flex">
        <div>NextDrive</div>
        <div className="flex gap-2">
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
        </div>
      </div>
    </header>
  );
}
