import { SideNav } from "@/components/side-nav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto h-full pt-20">
      <div className="flex h-full pb-5">
        <SideNav />
        <div className="h-full w-full rounded-r-2xl border border-gray-700 p-4">
          {children}
        </div>
      </div>
    </main>
  );
}
