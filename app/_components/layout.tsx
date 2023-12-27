import Header from "@/app/_components/Header";

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow flex flex-col bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default Layout;
