'use client'
import { useRouter } from 'next/navigation';
// import { Router } from 'next/router';
import React, { ChangeEvent } from 'react'
import { useState } from "react";

const Createpage = () => {
  const [formData, setFormData] = useState({workout: "", sets: "", reps: "", weight: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevData) => (
        {
            ...prevData,
            [e.target.name]: e.target.value, // extracts all data we already have, then updates accordingly
        }));
    // console.log(formData);
  };


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.workout || !formData.sets || !formData.reps || !formData.weight) {
        setError("Please fill in all the fields");
        return;
    }

    setError(null);
    setIsLoading(true);

    try {
        const response = await fetch('/api/workouts', {
            method: "POST", 
            headers: {
                "Content-type": "application/json",
            }, 
            body: JSON.stringify(formData),

        });

        if (!response.ok) {
            throw new Error('Failed to create Workout');
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
        <h2 className="text-2xl font-bold my-8">Add New Workout</h2>

        <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input type="text" name='workout' placeholder='Workout' value={formData.workout} className="py-1 px-4 border rounded-md" onChange={handleInputChange} />
        <input type="text" name='sets' placeholder='Sets' value={formData.sets} className="py-1 px-4 border rounded-md" onChange={handleInputChange} />
        <input type="text" name='reps' placeholder='Reps' value={formData.reps} className="py-1 px-4 border rounded-md" onChange={handleInputChange} />
        <input type="text" name='weight' placeholder='Weight' value={formData.weight} className="py-1 px-4 border rounded-md" onChange={handleInputChange} />

            
        <button className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer" type="submit" disabled={isLoading} >{isLoading ? "Adding..." : "Add Workout"}</button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}

export default Createpage