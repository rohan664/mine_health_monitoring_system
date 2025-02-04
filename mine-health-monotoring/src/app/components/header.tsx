// app/Header.tsx
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Image from 'next/image';
import DummuUser from "@/app/assest/svg/dummy-user.svg";
import { redirect } from 'next/navigation'

export default async function Header() {
  let userName:string = '';
  let role:string = '';

  const cookie = await cookies();
  const cookieValue = cookie.get("token");

  if (cookieValue) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    try {
      const userData = await jwtVerify(cookieValue.value, secret);
      userName = userData.payload.name ?? "rrrr";
      role = userData.payload.role || "Guest" as string;
    } catch (err) {
      console.error("Error verifying JWT:", err);
      redirect("/login")

    }
  }

  return (
    <div className='flex justify-end items-center w-full gap-2 p-4'>
      <div className='flex items-center justify-end lg:justify-center gap-2'>
        <div className='flex justify-center items-center'>
          <Image
            src={DummuUser}
            alt='dummy-user'
            height={40}
          />
        </div>  
        <div className='leading-5 hidden md:block'>
          <p className='font-bold'>{userName.split(" ").map((value)=>(value.charAt(0).toUpperCase() + value.slice(1))).join(" ")}</p>
          <p className='text-gray-400 font-bold'>{`${role.charAt(0).toUpperCase() + role.slice(1)}`}</p>
        </div>
      </div>
    </div>
  );
}
