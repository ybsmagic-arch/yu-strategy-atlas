import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ImportCaseClient } from "./import-case-client";
export default async function ImportCasePage(){const db=await createClient();const {data}=db?await db.auth.getUser():{data:{user:null}};if(!data.user)redirect("/admin/login");return <ImportCaseClient/>;}
