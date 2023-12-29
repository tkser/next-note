"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="h-14">
      <nav className="h-full flex items-center justify-between flex-wrap bg-gray-700 px-5 flex-row">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Link href="/" as="/">
            <span className="font-semibold text-xl tracking-tight select-none">
              Note
            </span>
          </Link>
        </div>
        <div className="block flex-grow flex items-center w-auto">
          <div className="text-sm text-right flex-grow">
            <Link href="/dashboard" as="/dashboard">
              <span className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-700 hover:bg-white mt-0 select-none">
                Dashboard
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
