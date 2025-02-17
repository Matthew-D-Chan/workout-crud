'use client'

import Link from 'next/link' // Importing Link
import { useState, useEffect } from "react";


interface IWorkout {
  $id: string;
  workout: string;
  sets: string;
  reps: string;
  weight: string;
}


export default function Home() {
  const [workouts, setWorkouts] = useState<IWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/workouts');
        if (!response.ok) {
          throw new Error("Failed to fetch workout");
        }
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.log("Error ", error);
        setError("Failed to load workouts, Please try reloading the page")
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);


  const handleDelete = async (id: string) => {
    try{
      await fetch(`/api/workouts/${id}`, { method: "DELETE" });
      setWorkouts((prevWorkouts) => 
        prevWorkouts?.filter((i) => i.$id !== id))// updating UI by filtering out the id found (the one we want deleted)
    } catch (error) {
      setError("Failed to delete interpretation. Please try again.")
    } 
  };

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading workouts...</p>
      ) : workouts?.length > 0 ? ( 
        <div>
          <h1 className="font-bold text-3xl mb-6">Keep Track of Your Lifts!</h1>
          {workouts?.map((workout) => (
            <div key={workout.$id}className="rounded-md mb-6 leading-8 outline outline-2 outline-offset-2">
              <div className="font-bold">{workout.workout}</div>
              <p>Sets: {workout.sets}</p>
              <p>Reps: {workout.reps}</p>
              <div className="flex justify-between items-center mb-6">
                <p>Weight: {workout.weight}</p>
                <div className="flex gap-4 justify-end">
                  <Link className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest" href={`/edit/${workout.$id}`}>Edit</Link>
                  <button onClick={() => handleDelete(workout.$id)} className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest">Delete</button>
                </div>
              </div>
            </div>
          ))};
        </div>
      ) : (
        <div className="text-2xl font-bold">No Workouts Yet... (Go to the Gym!!)</div>
      )}
    </div>
      
  );
}
