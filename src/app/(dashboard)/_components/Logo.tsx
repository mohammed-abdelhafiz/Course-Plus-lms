import Image from "next/image";

export const Logo = () => {
  return (
    <div className="p-6">
      <Image src="/logo.svg" alt="Logo" width={130} height={130} />
    </div>
  );
};
