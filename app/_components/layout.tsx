import Header from "./Header";

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow flex flex-col">{children}</main>
    </div>
  );
};

export default Layout;
