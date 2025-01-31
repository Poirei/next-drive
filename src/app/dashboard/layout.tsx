import { SideNav } from "@/components/side-nav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto pt-20 h-full">
      <div className="flex h-full pb-5">
        <SideNav />
        <div className="w-full border border-gray-700 rounded-r-md h-full p-4">
          {children}
        </div>
      </div>
    </main>
  );
}
