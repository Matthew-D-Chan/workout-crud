import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

const database = new Databases(client); // Passing the appwrite client that we imported in 

// Fetch a specific workout 

async function fetchWorkout(id: string) {
    try{
        const workout = await database.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, 
            "Workouts",
            id
        );
        return workout
    } catch {
        console.error("Error fetching workout");
        throw new Error("Failed to fetch workout");
    }
}


// Delete a specific workout (backend)

async function deleteWorkout(id: string) {
    try {
        const response = await database.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, 
            "Workouts",
            id
        );

        return response;
    } catch {
        console.error("Error deleting workout");
        throw new Error("Failed to delete workout");
    }
}


// Update a specific workout (backend)

async function updateWorkout(id: string, data: {workout: string, sets: string, reps: string, weight: string}) {
    try {
        const response = await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, 
            "Workouts",
            id,
            data
        );

        return response;
    } catch {
        console.error("Error updating workout");
        throw new Error("Failed to update workout");
    }
}


export async function GET(_req: NextRequest, {params}: { params: { id: string } }) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "Invalid ID parameter"}, { status: 400});
        }
        const workout = await fetchWorkout(params.id);
        return NextResponse.json({workout});
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch workout"},
            { status: 500 }
        );
    }
}


export async function DELETE(
    _req: NextRequest, 
    { params } : { params: { id: string } }
) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "Invalid ID parameter"}, { status: 400});
        }
        await deleteWorkout(params.id);
        return NextResponse.json({message: "Workout deleted"});
    } catch {
        return NextResponse.json(
            { error: "Failed to delete workout"},
            { status: 500 }
        );
    }
}


export async function PUT(
    req: NextRequest, 
    { params } : { params: { id: string } }
) {
    try {
        if (!params.id) {
            return NextResponse.json({ error: "Invalid ID parameter"}, { status: 400});
        }
        const workout = await req.json();
        await updateWorkout(params.id, workout);
        return NextResponse.json({message: "Workout updated"});
    } catch {
        return NextResponse.json(
            { error: "Failed to update workout"},
            { status: 500 }
        );
    }
}