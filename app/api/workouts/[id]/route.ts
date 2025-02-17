import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client); // Passing the appwrite client that we imported in 

// Fetch a specific workout 

async function fetchWorkout(id: string) {
    try{
        const workout = await database.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, 
            "Workouts",
            id
        );
        return workout
    } catch (error) {
        console.error("Error fetching workout", error);
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
    } catch (error) {
        console.error("Error deleting workout", error);
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
    } catch (error) {
        console.error("Error updating workout", error);
        throw new Error("Failed to update workout");
    }
}


export async function GET(
    req: Request, 
    { params } : { params: { id: string } }
) {
    try {
        const { id } = await params;
        const workout = await fetchWorkout(id);
        return NextResponse.json({workout});
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch interpretation"},
            { status: 500 }
        );
    }
}


export async function DELETE(
    req: Request, 
    { params } : { params: { id: string } }
) {
    try {
        const { id } = await params;
        await deleteWorkout(id);
        return NextResponse.json({message: "Workout deleted"});
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete interpretation"},
            { status: 500 }
        );
    }
}


export async function PUT(
    req: Request, 
    { params } : { params: { id: string } }
) {
    try {
        const { id } = await params;
        const workout = await req.json();
        await updateWorkout(id, workout);
        return NextResponse.json({message: "Interpretation updated"});
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update interpretation"},
            { status: 500 }
        );
    }
}