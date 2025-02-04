import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

export const config = {
    runtime: "nodejs",
    matcher: ["/dashboard", "/"],
};

export const middleware = async (req: NextRequest) => {
    const cookies = req.cookies;
    const token = cookies.get("token");

    
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if(req.nextUrl.pathname === "/"){ 
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        let userdata = await jwtVerify(token.value, secret)
    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }


    return NextResponse.next();
};

