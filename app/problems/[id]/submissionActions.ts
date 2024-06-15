"use server";

import { isLogged } from "@/components/helpers";
import {submissionSchema} from "./submissionSchema";
import prisma from "@/prisma/client";


export const createSubmission = async (dataStr: string) => {
    const user = await isLogged(`/api/auth/signin?callbackUrl=/problems/`);
    const jsonData = JSON.parse(dataStr);
    const validation = submissionSchema.safeParse(jsonData);
    if (!validation.success) {
        return {ok: false, message: validation.error.toString()};
    }
    const data = validation.data;
    
    try {
        await prisma.submission.create({
        data,
        });
    } catch (e: any) {
        console.error(e);
        return {ok: false, message: e.toString()};
    }
    return {ok: true};
};
