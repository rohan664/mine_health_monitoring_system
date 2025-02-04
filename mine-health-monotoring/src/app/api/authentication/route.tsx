import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { INVALID_REQUEST_OBJECT, USER_EXISTS,USER_NOT_FOUND,INVALID_PASSWOED,DATA_RETRTIVED_SUCCESSFULLY } from "@/app/utils/messages";
import { SALT_ROUNDS,MESSAGES,TOKEN } from "@/app/utils/constants";
import { SignJWT } from "jose";

const prisma = new PrismaClient();

// this route is used to create a new user
export async function POST(req:NextRequest, res:NextResponse) {
    try {
        const data = await req.json();
        if(!data?.email || !data?.password || !data?.name || !data?.role) {
            return NextResponse.json({ MESSAGES: INVALID_REQUEST_OBJECT }, { status: 400 });
        }
        // check if user already exists
        const userExists = await prisma.user.findFirst({
            where: { email: data.email }
        });
        if(userExists) {
            return NextResponse.json({ MESSAGE: USER_EXISTS }, { status: 400 });
        }
        // hash the password
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                name: data?.name,
                email: data?.email,
                password: hashedPassword,
                role: data?.role,
            }
        });
        return NextResponse.json(user,{status:200});
    }
    catch(err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }

}

export async function GET(req:NextRequest, res:NextResponse) {
    try{
        const { searchParams } = new URL(req.url);
        let credentials = searchParams.get('credentials');
        let rememberMe = searchParams.get('rememberMe');
        if (!credentials) {
            return NextResponse.json({ MESSAGE: INVALID_REQUEST_OBJECT }, { status: 400 });
        }
        const [email, password] = atob(credentials).split(":");
        const user = await prisma.user.findFirst({
            where:{email:email}
        })
        if(!user){
            return NextResponse.json({MESSAGE:USER_NOT_FOUND},{status:404});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return NextResponse.json({MESSAGE:INVALID_PASSWOED},{status:400});
        }

        // create a token
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({name:user.name,email:user.email,role:user.role}).setProtectedHeader({ alg: "HS256" }).setExpirationTime(rememberMe == 'True' ? '7d':'1h').sign(secretKey); 
        return NextResponse.json({MESSAGE : DATA_RETRTIVED_SUCCESSFULLY,TOKEN:token},{status:200});
    }
    catch(err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}