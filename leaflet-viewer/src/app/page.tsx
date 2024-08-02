import Image from "next/image";
import Link from "next/link";
import { FaStreetView } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl font-mono text-sm">
        <div className="items-center flex m-5">
          <p className="fixed left-0 top-0 flex w-full items-center justify-center pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl  lg:p-4  text-2xl space-x-5">
            <FaStreetView />
            <p>leaflet viewer italy</p>
          </p>
        </div>
        <div className="flex m-5 space-x-10">
          <Link href="/drawPolygons">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 hover:scale-105 hover:bg-zinc-900 hover:text-gray-200">
              draw polygons
            </p>
          </Link>
          <Link href="/comuneByAddress">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 hover:scale-105 hover:bg-zinc-900 hover:text-gray-200">
              comune by address
            </p>
          </Link>
          <Link href="/codiceBelfioreGetAddresses">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 hover:scale-105 hover:bg-zinc-900 hover:text-gray-200">
              codice belfiore get address
            </p>
          </Link>
          <Link href="/getIndirizziByCodeBelfioreWithLayers">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 hover:scale-105 hover:bg-zinc-900 hover:text-gray-200">
              codice belfiore get addresses layers
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
