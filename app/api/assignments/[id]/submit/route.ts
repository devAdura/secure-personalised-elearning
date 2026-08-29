import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissionSchema } from "@/lib/validators";
import { logSecurityEvent } from "@/lib/security-log";
import { apiError } from "@/lib/api";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user=await getCurrentUser(); if(!user||user.role!=="STUDENT")return NextResponse.json({error:"Student access required."},{status:403}); const{id}=await params;
  try { const data=submissionSchema.parse(await request.json()); const assignment=await db.assignment.findUnique({where:{id},include:{course:{select:{lecturerId:true,title:true}},submissions:{where:{studentId:user.id},select:{id:true}}}}); if(!assignment)throw new Error("Assignment not found."); const enrolled=await db.enrollment.findUnique({where:{userId_courseId:{userId:user.id,courseId:assignment.courseId}}}); if(!enrolled)throw new Error("You must be enrolled in this course."); if(assignment.dueDate<=new Date()){await logSecurityEvent({request,userId:user.id,action:"ASSIGNMENT_SUBMISSION",status:"FAILURE",metadata:{assignmentId:id,reason:"deadline_elapsed"}});return NextResponse.json({error:"The submission deadline has passed. This assignment is now closed."},{status:409});} const submission=await db.submission.upsert({where:{assignmentId_studentId:{assignmentId:id,studentId:user.id}},update:{content:data.content,fileUrl:data.fileUrl||null,submittedAt:new Date()},create:{assignmentId:id,studentId:user.id,content:data.content,fileUrl:data.fileUrl||null}}); await db.notification.create({data:{userId:assignment.course.lecturerId,title:"New assignment submission",message:`${user.name} submitted ${assignment.title} in ${assignment.course.title}.`}}); await logSecurityEvent({request,userId:user.id,action:"ASSIGNMENT_SUBMISSION",status:"SUCCESS",metadata:{assignmentId:id,submissionId:submission.id}}); return NextResponse.json({submission}); } catch(error){await logSecurityEvent({request,userId:user.id,action:"ASSIGNMENT_SUBMISSION",status:"FAILURE",metadata:{assignmentId:id}});return apiError(error,"Submission failed");}
}
