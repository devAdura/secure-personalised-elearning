import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Authentication required."},{status:401});const{id}=await params;const post=await db.discussionPost.findUnique({where:{id},include:{course:{select:{lecturerId:true}}}});if(!post)return NextResponse.json({error:"Post not found."},{status:404});const allowed=post.authorId===user.id||post.course.lecturerId===user.id||user.role==="ADMIN";if(!allowed)return NextResponse.json({error:"Access denied."},{status:403});await db.discussionPost.delete({where:{id}});return NextResponse.json({success:true});}
