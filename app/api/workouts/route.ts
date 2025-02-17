import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client); // Passing the appwrite client that we imported in 

// Create workout (backend)
// Async function that waits for the four criterias to be present, and then runs to create a workout
async function createWorkout(data: {
    workout: string; 
    sets: string; 
    reps: string; 
    weight: string;
}) {
    try {
        // syntax for appwrite
        const response = await database.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, 
            "Workouts", // The collection id 'Workouts' from Appwrite
            ID.unique(), // Generates unique ids each time
            data // The actual data being passed
        );

        return response;
    } catch (error) {
        console.error('Error creating Workout', error);
        throw new Error ("Failed to create workout");
    }
}


// Fetch workouts
async function fetchWorkouts() {
    try {
        // syntax for appwrite
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, 
            "Workouts", // The collection id 'Workouts' from Appwrite
            [Query.orderDesc("$createdAt")]
        );

        return response.documents;
    } catch (error) {
        console.error('Error fetching Workout', error);
        throw new Error ("Failed to fetch workout");
    }
}

// POST Request
export async function POST(req: Request) {
    try {
        const {workout, sets, reps, weight} = await req.json();
        const data = {workout, sets, reps, weight};
        const response = await createWorkout(data);
        return NextResponse.json({message: "Workout created"})
    } catch (error) {
        return NextResponse.json(
            {
                error: "Failed to create interpretation",
            },
            {status: 500 }
        );
    }
}

// GET Request 
export async function GET() {
    try {
        const workouts = await fetchWorkouts();
        return NextResponse.json(workouts);
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to fetch interpretations" },
            { status: 500 }
        );
    }
}