'use client'
import { useRouter } from 'next/navigation';
import React, { ChangeEvent } from 'react'
import {useEffect, useState } from "react"

const Edit = ({params}: { params: { id: string } }) => {
  const [formData, setFormData] = useState({workout: "", sets: "", reps: "", weight: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/workouts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch workout");
        }

        const data = await response.json();
        setFormData({workout: data.workout.workout, sets: data.workout.sets, reps: data.workout.reps, weight: data.workout.weight});
      } catch {
        setError("Failed to load workout");
      }
    };

    fetchData();
  }, []);



  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevData) => (
        {
            ...prevData,
            [e.target.name]: e.target.value, // extracts all data we already have, then updates accordingly
        }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.workout || !formData.sets || !formData.reps || !formData.weight) {
      setError("Please fill in all the fields");
      return;
  }

  setError(null);
  setIsLoading(true);

  try {
      const { id } = await params;
      const response = await fetch(`/api/workouts/${id}`, {
          method: "PUT", 
          headers: {
              "Content-type": "application/json",
          }, 
          body: JSON.stringify(formData),

      });

      if (!response.ok) {
          throw new Error('Failed to update Workout');
      }

    router.push("/");
  } catch {
      setError("Something went wrong");
  } finally {
      setIsLoading(false);
  }
  };

  return (
    <div>
        <h2 className="text-2xl font-bold my-8">Edit Workout</h2>

        <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input type="text" name='workout' placeholder='Workout' value={formData.workout} className="py-1 px-4 border rounded-md" onChange={handleInputChange} />
        <input type="text" name='sets' placeholder='Sets' value={formData.sets} className="py-1 px-4 border rounded-md" onChange={handleInputChange}/>
        <input type="text" name='reps' placeholder='Reps' value={formData.reps} className="py-1 px-4 border rounded-md" onChange={handleInputChange}/>
        <input type="text" name='weight' placeholder='Weight' value={formData.weight} className="py-1 px-4 border rounded-md" onChange={handleInputChange}/>

            
        <button className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer">{isLoading ? "Updating..." : "Update Workout"}</button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}

export default Edit