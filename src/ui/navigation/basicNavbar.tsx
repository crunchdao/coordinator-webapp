import Image from "next/image";
import Link from "next/link";

export const BasicNavbar: React.FC = () => {
  return (
    <nav className="md:absolute max-md:border-b top-0 py-4 px-5 md:px-8 flex justify-start w-full z-10">
      <Link href="/">
        <Image
          priority
          src="/images/crunch-lab-logo.svg"
          alt="Crunch Lab logo"
          width={107}
          height={20}
        />
      </Link>
    </nav>
  );
};
